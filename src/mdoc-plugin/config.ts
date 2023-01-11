import { Config, Node, RenderableTreeNode, Tag } from "@markdoc/markdoc";
import { HeaderLevel } from "./utils/custom-header";
import { HeaderManager } from "./utils/generate-toc";

export const config: Config = {
	nodes: {
		heading: {
			children: ["inline"],
			attributes: {
				level: { type: HeaderLevel, required: true },
				id: { type: "String" },
			},
			transform(node: Node, config: Config) {
				return new Tag(
					`h${+node.attributes["level"] + 1}`,
					node.transformAttributes(config),
					node.transformChildren(config)
				);
			},
		},
	},
};

export const rummageTree = async (tree: RenderableTreeNode) => {
	const toc = HeaderManager.navigate(tree);

	return { tree, toc };
};
