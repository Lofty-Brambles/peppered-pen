import type { z } from "zod";
import glob from "fast-glob";

import { get } from "./manager";
import Markdoc from "./components/Markdoc.astro";

const readFile = async <T extends z.ZodTypeAny>(path: string, schema: T) => {
	return await get({ path, schema });
};

const readDir = async <T extends z.ZodTypeAny>(path: string, schema: T) => {
	const allPaths = await glob(`${path}/**/*.{md,mdoc}`);
	return Promise.all(
		allPaths.map((p) => get<typeof schema>({ path: p, schema }))
	);
};

export { Markdoc, readFile, readDir };
