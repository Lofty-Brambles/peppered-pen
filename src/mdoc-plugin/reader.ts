import {
	type Node,
	parse,
	transform,
	validate,
	ValidateError,
} from "@markdoc/markdoc";
import matter from "gray-matter";
import glob from "fast-glob";
import type { z } from "zod";
import { CONSTANTS } from "@/utilities/env";

import { basename, extname, join } from "path";
import { readFile, readdir } from "node:fs/promises";

export type Plugin = (ast: Node) => Node | Promise<Node>;

type Read<T> = {
	dir: string;
	schema: T;
};

export async function read<T extends z.ZodTypeAny>({ dir, schema }: Read<T>) {
	const dirPath = join(process.cwd(), dir);
	const paths = await glob(`${dirPath}/*.{md,mdoc}`);
	return Promise.all(paths.map((path) => fetch({ path, schema })));
}

type Fetch<T> = {
	path: string;
	schema: T;
};

async function fetch<T extends z.ZodTypeAny>({ path, schema }: Fetch<T>) {
	const rawContent = await readFile(path);
	const { content, data } = matter(rawContent);

	const plugins = await getPlugins();
	const renderableTree = formRenderableTree({ content, plugins });
	const frontmatter = validateFrontmatter<T>({ data, path, schema });

	const slug = basename(path, extname(path));
	return { slug, renderableTree, frontmatter };
}

async function getPlugins() {
	const pluginsDir = join(process.cwd(), CONSTANTS.mdocPlugs);
	const files = await readdir(pluginsDir);
	const allPlugins = files
		.filter((p) => /.[tj]s$/.test(p))
		.map((p) => join(pluginsDir, p));

	return Promise.all(
		allPlugins.map(async (p) => {
			const { default: main } = await import(p);
			return async (ast: Node) =>
				(await main(ast)) as Node | Promise<Node>;
		})
	);
}

type Parser = {
	content: string;
	plugins: Plugin[];
};

async function formRenderableTree({ content, plugins }: Parser) {
	const ast = parse(content);

	for (const p of plugins) {
		await p(ast);
		const errors = validate(ast);
		if (errors.length) throwError(p, errors);
	}

	return transform(ast);
}

function throwError(p: Plugin, errors: ValidateError[]) {
	throw new Error(
		`The AST tree is invalid. Please check the ${p.name} plugin.
Error:${JSON.stringify(errors, undefined, 2)}`
	);
}

type Validator<T> = {
	data: Record<string, any>;
	path: string;
	schema: T;
};

async function validateFrontmatter<T extends z.ZodTypeAny>({
	data,
	path,
	schema,
}: Validator<T>) {
	try {
		return schema.parse(data) as z.infer<T>;
	} catch (e) {
		throw new Error(`There was an issue in parsing frontmatter.
The frontmatter of the following file doesn't match the schema: ${path}`);
	}
}
