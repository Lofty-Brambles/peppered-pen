import type { Schema } from "@markdoc/markdoc";
import { CodelinePattern } from "./handle-patterns";

export const code: Schema = {
	render: "code-astro",
	selfClosing: false,
	attributes: {
		title: { type: String, render: false, required: true },
		language: { type: String, default: "txt" },
		mark: { type: CodelinePattern, render: false },
		add: { type: CodelinePattern, render: false },
		delete: { type: CodelinePattern, render: false },
		process: { type: Boolean, default: false, render: false },
	},
};

export * from "./handle-patterns";
