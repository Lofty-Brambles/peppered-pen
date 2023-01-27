import { defineConfig } from "astro/config";
import { CONSTANTS } from "./src/utilities/env";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	integrations: [svelte(), prefetch(), sitemap(), compress()],
	site: CONSTANTS.site(),
	vite: {
		resolve: {
			alias: { "@utils": resolve(__dirname, "src/utilities/utils") },
		},
	},
});
