import type {
	Config,
	ValidationError,
	CustomAttributeTypeInterface,
} from "@markdoc/markdoc";

const attrErrors = {
	INVALID_PATTERN_COLLECTION: {
		id: "invalid-pattern-collection",
		level: "error",
		message: "The pattern must be a string or an array of strings",
	} as ValidationError,
	INVALID_NUMBER_PATTERN: {
		id: "invalid-number-pattern",
		level: "error",
		message: "The pattern must be of the form {x,y-z}",
	} as ValidationError,
};

const stringCheck = (value: unknown) => {
	const NUMBER_COLLECTION = /^{(?:\d+|\d+-\d+)(?:,(?:\d+|\d+-\d+))*}$/;

	if (typeof value !== "string")
		return [attrErrors.INVALID_PATTERN_COLLECTION];
	if (!NUMBER_COLLECTION.test(value))
		return [attrErrors.INVALID_NUMBER_PATTERN];
	return [];
};

export class CodelinePattern implements CustomAttributeTypeInterface {
	validate(value: any, _config: Config): ValidationError[] {
		if (!Array.isArray(value)) return stringCheck(value);
		return value.flatMap((element) => stringCheck(element));
	}
}

type className = string;
type range = string;
type LineOptions = {
	line: number;
	classes?: string[];
};

export class rangeParser {
	private map = new Map<number, LineOptions>();

	public getLineOpts(ranges: Record<className, range>) {
		Object.entries(ranges)
			.flatMap((args) => this._rangePool(...args))
			.forEach(this._handleLineOption);

		return [...this.map.values()];
	}

	private _handleLineOption([line, value]: [number, string]) {
		if (!this.map.has(line)) {
			this.map.set(line, { line, classes: [value] });
		} else {
			const remaining = this.map.get(line)!;
			remaining.classes?.push(value);
			this.map.set(line, remaining);
		}
	}

	private _rangePool(props: string, range: string) {
		const collection = new Set(this._parseRange(range));
		return [...collection.values()].map(
			(line) => [line, props] as [number, string]
		);
	}

	private _parseRange(range: string) {
		return range.slice(1, -1).split(",").flatMap(this._parseRangeElement);
	}

	private _parseRangeElement(element: string) {
		if (!element.includes("-")) return +element;

		const [first, second] = element.split("-");
		const max = Math.max(+first!, +second!);
		const min = Math.min(+first!, +second!);

		return Array.from({ length: max - min + 1 }, (_, i) => min + i);
	}
}
