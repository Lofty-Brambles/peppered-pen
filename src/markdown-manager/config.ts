import type { Node, Config, RenderableTreeNode } from "@markdoc/markdoc";
import { Tag } from "@markdoc/markdoc";
import { HeaderLevel, HeaderManager } from "./plugins/headings";
import { code } from "./plugins/code-snippets";

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
			transform: disableTransform(
				"This is disabled, please use the {% inline-code %} tag instead."
			),
		},
		fence: {
			transform: disableTransform(
				"This is disabled, please use the {% code %} tag instead."
			),
		},
	},
	tags: {
		code,
	},
};

export const rummageTree = async (tree: RenderableTreeNode) => {
	const toc = HeaderManager.navigate(tree);

	return { tree, toc };
};

function headingTransform(node: Node, config: Config) {
	return new Tag(
		`h${+node.attributes["level"] + 1}`,
		node.transformAttributes(config),
		node.transformChildren(config)
	);
}

function disableTransform(error: string) {
	return function () {
		throw new Error(error);
	};
}
