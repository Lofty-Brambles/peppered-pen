import type { z } from "zod";
import matter from "gray-matter";
import { parse, transform, validate } from "@markdoc/markdoc";
import { readFile } from "node:fs/promises";
import { config, rummageTree } from "./config";

const safeReadFile = async (path: string) => {
	try {
		return await readFile(path, "utf-8");
	} catch (e) {
		throw new Error(`
There was an issue with the file path mentioned.
No file was found at: ${path}
	`);
	}
};

const usePlugins = async (content: string) => {
	const ast = parse(content);

	const errors = validate(ast, config);
	if (errors.length)
		throw new Error(`
The AST tree is invalid.
Please check the config.
Error: ${JSON.stringify(errors, undefined, 2)}
	`);

	const transformedTree = transform(ast, config);
	return await rummageTree(transformedTree);
};

type Validator<T> = { data: Record<string, any>; schema: T; path: string };

const validateData = <T extends z.ZodTypeAny>(props: Validator<T>) => {
	const result = props.schema.safeParse(props.data);
	if (result.success) return result.data as z.infer<T>;
	throw new Error(`
There was an issue in parsing frontmatter.
The frontmatter of the following file doesn't match the schema: ${props.path}
The error is: ${JSON.stringify(result.error, undefined, 2)}
	`);
};

type Fetcher<T> = { path: string; schema: T };

export const get = async <T extends z.ZodTypeAny>(props: Fetcher<T>) => {
	const file = await safeReadFile(props.path);
	const { content, data } = matter(file);

	const fileNameWithExtension = props.path.split("/").pop();
	if (fileNameWithExtension === undefined)
		throw new Error(`Bad File name: ${props.path}`);
	const fileName = fileNameWithExtension.replace(/\.[^.]*$/, "");

	const { tree, ...properties } = await usePlugins(content);
	const meta = validateData({ data, schema: props.schema, path: props.path });

	return { slug: fileName, tree, meta, properties };
};
