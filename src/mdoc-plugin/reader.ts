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

import { basename, extname, posix } from "path";
import { readFile } from "node:fs/promises";

export type Plugin = (ast: Node) => Node | Promise<Node>;

type Read = {
	dir: string;
	type: string;
};

export async function read<T extends z.ZodTypeAny>({ dir, type }: Read) {
	const dirPath = posix.join(process.cwd(), dir);
	const paths = await glob(`${dirPath}/**/*.{md,mdoc}`);``

	let schema: T;
	const schematics = Object.entries(import.meta.glob<T>("./*.config.ts"));
	for (const schematicFile of schematics) {
		if (!schematicFile[0].includes(type)) continue;
		schema = await schematicFile[1]();
		break;
	}

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
	const renderableTree = await formRenderableTree({ content, plugins });
	const frontmatter = await validateFrontmatter<T>({ data, path, schema });

	const id = basename(path, extname(path));
	return { id, renderableTree, frontmatter };
}

async function getPlugins() {
	const plugins = import.meta.glob<Plugin>("./*.plugin.ts");
	return Promise.all(
		Object.values(plugins).map(async (plug) => await plug())
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
