import type {
	Config,
	ValidationError,
	CustomAttributeTypeInterface,
} from "@markdoc/markdoc";

const attrErrors = {
	INVALID_HEADER_PROPERTY: {
		id: "invalid-header-property",
		level: "error",
		message: "The level of the heading must be a number",
	} as ValidationError,
	INVALID_HEADER_LEVEL: (value: number) => {
		return {
			id: "invalid-header-level",
			level: "error",
			message: `The level of the heading must be between 1 and 5. ${value}`,
		} as ValidationError;
	},
};

export class HeaderLevel implements CustomAttributeTypeInterface {
	validate(value: any, _config: Config): ValidationError[] {
		if (typeof value !== "number")
			return [attrErrors.INVALID_HEADER_PROPERTY];
		if (!/[1-5]/.test(`${value}`))
			return [attrErrors.INVALID_HEADER_LEVEL(value)];
		return [];
	}
}
