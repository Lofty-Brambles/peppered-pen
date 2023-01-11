import type {
	Config,
	ValidationError,
	CustomAttributeTypeInterface,
} from "@markdoc/markdoc";

export class HeaderLevel implements CustomAttributeTypeInterface {
	validate(value: any, _config: Config): ValidationError[] {
		if (typeof value !== "number")
			return [
				{
					id: "invalid-header-property",
					level: "error",
					message: "The level of the heading must be a number",
				},
			];

		if (!/[1-5]/.test(`${value}`))
			return [
				{
					id: "invalid-header-level",
					level: "error",
					message: `The level of the heading must be between 1 and 5. ${value}`,
				},
			];

		return [];
	}
}
