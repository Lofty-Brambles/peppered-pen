import type { Schema } from "@markdoc/markdoc";
import { CodelinePattern } from "./handle-patterns";

export const code: Schema = {
	render: "code",
	selfClosing: false,
	attributes: {
		title: { type: String, render: false, required: true },
		language: { type: String, default: "txt", render: "data-language" },
		mark: { type: CodelinePattern, render: false },
		add: { type: CodelinePattern, render: false },
		delete: { type: CodelinePattern, render: false },
		process: { type: Boolean, default: false, render: false },
	},
};
