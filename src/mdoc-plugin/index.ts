import type { z } from "zod";
import glob from "fast-glob";

import { get, getSchema } from "./manager";
import { yeetNoSchemaFoundError } from "./util";
import Markdoc from "./components/Markdoc.astro";

const readFile = async <T extends z.ZodTypeAny>(path: string, id: string) => {
	const schema: T | undefined = await getSchema(id);
	if (schema === undefined) yeetNoSchemaFoundError(id);
	return await get<T>({ path, schema: schema! });
};

const readDir = async <T extends z.ZodTypeAny>(path: string, id: string) => {
	const schema: T | undefined = await getSchema(id);
	if (schema === undefined) yeetNoSchemaFoundError(id);

	const allPaths = await glob(`${path}/**/*.{md,mdoc}`);
	return Promise.all(allPaths.map((p) => get({ path: p, schema: schema! })));
};

export { Markdoc, readFile, readDir };
