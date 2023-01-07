import { defineConfig } from "astro/config";
import { CONSTANTS } from "./src/utilities/env";

import svelte from "@astrojs/svelte";
import image from "@astrojs/image";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	integrations: [
		svelte(),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
		prefetch(),
		compress(),
		sitemap(),
	],
	site: CONSTANTS.site(),
});
