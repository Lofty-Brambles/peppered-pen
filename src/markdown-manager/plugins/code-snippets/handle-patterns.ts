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
