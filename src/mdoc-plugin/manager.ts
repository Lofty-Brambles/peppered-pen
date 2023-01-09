import type { z } from "zod";
import { Node, parse, transform } from "@markdoc/markdoc";

import matter from "gray-matter";
import { validate } from "@markdoc/markdoc";

import {
	asyncForEach,
	yeetBadASTError,
	yeetBadFrontmatterError,
	safeReadFile,
} from "./util";

export type Plugin = (ast: Node) => Node | Promise<Node>;

const getPlugins = () => {
	const plugins = import.meta.glob<Plugin>("./*.plugin.ts");
	return Promise.all(
		Object.values(plugins).map(async (plug) => await plug())
	);
};

const usePlugins = async (ast: Node) => {
	const plugins = await getPlugins();
	asyncForEach(plugins, async (plugin) => {
		ast = await plugin(ast);
		const errors = validate(ast);
		if (errors.length) yeetBadASTError(plugin.name, errors);
	});
};

type Validator<T> = { data: Record<string, any>; schema: T; path: string };

const validateData = <T extends z.ZodTypeAny>(props: Validator<T>) => {
	const result = props.schema.safeParse(props.data);
	if (result.success) return result.data as z.infer<T>;
	yeetBadFrontmatterError(props.path, result.error);
	return undefined;
};

type Fetcher<T> = { path: string; schema: T };

export const get = async <T extends z.ZodTypeAny>(props: Fetcher<T>) => {
	const file = await safeReadFile(props.path);
	const { content, data } = matter(file);

	const ast = parse(content);
	await usePlugins(ast);
	const meta = validateData({ data, schema: props.schema, path: props.path });

	return { tree: transform(ast), meta };
};

export const getSchema = async <T extends z.ZodTypeAny>(id: string) => {
	const allSchemes = import.meta.glob<{ schema: T }>("./*.config.ts");

	let schema = undefined;
	asyncForEach(Object.entries(allSchemes), async ([name, getSchema]) => {
		if (name === id) schema = (await getSchema()).schema;
	});

	return schema as T | undefined;
};
