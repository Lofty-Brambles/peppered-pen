import type { ValidateError } from "@markdoc/markdoc";
import { readFile } from "node:fs/promises";

type asyncCallback<T> = (value: T, index?: number, arr?: T[]) => Promise<void>;

export const asyncForEach = async <T>(array: T[], cb: asyncCallback<T>) => {
	for (let i = 0; i < array.length; i++) {
		await cb(array[i]!, i, array);
	}
};

export const yeetBadASTError = (name: string, errors: ValidateError[]) => {
	throw new Error(`
The AST tree is invalid.
Please check the ${name} plugin.
Error: ${JSON.stringify(errors, undefined, 2)}
	`);
};

export const yeetBadFrontmatterError = (path: string, error: unknown) => {
	throw new Error(`
There was an issue in parsing frontmatter.
The frontmatter of the following file doesn't match the schema: ${path}
The error is: ${JSON.stringify(error, undefined, 2)}
	`);
};

export const yeetNoSchemaFoundError = (name: unknown) => {
	throw new Error(`
There was an issue with the schema mentioned.
The schema with the name ${JSON.stringify(name, undefined, 2)} was not found.
	`);
};

export const safeReadFile = async (path: string) => {
	try {
		return await readFile(path, "utf-8");
	} catch (e) {
		throw new Error(`
There was an issue with the file path mentioned.
No file was found at: ${path}
	`);
	}
};
