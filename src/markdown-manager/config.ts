import type { Node, Config, RenderableTreeNode } from "@markdoc/markdoc";
import { Tag } from "@markdoc/markdoc";
import { HeaderLevel, HeaderManager } from "./plugins/headings";
import { code } from "./plugins/code-snippets";
import { ReadingTimeManager } from "./plugins/reading-time";
import { emoji } from "./plugins/accessible-emojis";

export const config: Config = {
	nodes: {
		heading: {
			children: ["inline"],
			attributes: {
				level: { type: HeaderLevel, required: true },
				id: { type: "String" },
			},
			transform: headingTransform,
		},
		code: {
			children: ["inline"],
			attributes: {
				content: { type: String, render: false, required: true },
			},
			transform: codeTransform,
		},
		fence: {
			transform: () => {
				throw new Error(
					"This is disabled, please use the {% code %} tag instead."
				);
			},
		},
	},
	tags: {
		code,
	},
	variables: {
		emoji,
	},
};

export const rummageTree = async (tree: RenderableTreeNode) => {
	const toc = HeaderManager.navigate(tree);
	const readingTime = ReadingTimeManager.navigate(tree);

	return { tree, toc, readingTime };
};

function headingTransform(node: Node, config: Config) {
	return new Tag(
		`h${+node.attributes["level"] + 1}`,
		node.transformAttributes(config),
		node.transformChildren(config)
	);
}

function codeTransform(node: Node, config: Config) {
	return new Tag("inline-code-astro", node.transformAttributes(config), [
		node.attributes.content,
	]);
}
