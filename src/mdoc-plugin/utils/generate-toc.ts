import type { RenderableTreeNode, Scalar } from "@markdoc/markdoc";
import { Tag } from "@markdoc/markdoc";
import Slugger from "github-slugger";

type Node = RenderableTreeNode;
type TocTable = { id: string; content: string; slug: string }[];

export class HeaderManager {
	public static navigate(node: Node) {
		const toc: TocTable = [];
		const slugger = new Slugger();
		this._worker(node, toc, slugger);
		slugger.reset();
		return toc;
	}

	private static _worker(node: Node, toc: TocTable, slugger: Slugger) {
		if (!Tag.isTag(node)) return;

		// iterative pre order traversal of the tree to list toc and wrap headings
		const queue: Tag[] = [node];
		while (queue.length !== 0) {
			const tempQueue: Tag[] = [];
			const tag = queue.pop()!;

			if (tag.children.length === 0) break;
			tag.children.forEach((child, i) => {
				if (!Tag.isTag(child)) return;
				else if (!/^h[2-6]$/.test(child.name)) tempQueue.push(child);
				else tag.children[i] = this._workHeading(child, toc, slugger);
			});

			queue.push(...tempQueue.reverse());
		}
	}

	private static _workHeading(tag: Tag, toc: TocTable, slugger: Slugger) {
		const content = this._getSlugData(tag);
		const slug = slugger.slug(content);
		toc.push({ id: tag.name, content, slug });
		return this._formatHeading(tag, content, slug);
	}

	private static _getSlugData(tag: Tag, str: string = "") {
		if (tag.children.length === 0) return str;
		tag.children.forEach((child) => {
			if (Tag.isTag(child)) str += this._getSlugData(child);
			else str += this._getString(child);
		});
		return str;
	}

	private static _getString(scalar: Scalar, str: string = "") {
		if (typeof scalar === "string" || typeof scalar === "number") {
			str += scalar;
		} else if (Array.isArray(scalar)) {
			scalar.forEach((c) => (str += this._getString(c)));
		} else if (scalar !== null && typeof scalar === "object") {
			Object.values(scalar).forEach((c) => (str += this._getString(c)));
		}
		return str;
	}

	private static _formatHeading(tag: Tag, content: string, slug: string) {
		const SVG_DIMENSIONS = 24;

		return new Tag("div", { tabindex: -1, class: "heading-wrapper" }, [
			tag,
			new Tag("a", { href: `#${slug}`, class: "anchor-tags" }, [
				new Tag("span", { "aria-hidden": true, class: "anchor-icon" }, [
					this._linkSvg(SVG_DIMENSIONS),
				]),
				new Tag("span", { "is-raw": true, class: "sr-only" }, [
					`Section named ${content}`,
				]),
			]),
		]);
	}

	private static _linkSvg(dimensions: number) {
		return new Tag(
			"svg",
			{
				width: dimensions,
				height: dimensions,
				version: 1.1,
				viewBox: "0 0 16 16",
				xlmns: "http://www.w3.org/2000/svg",
			},
			[
				new Tag("path", {
					fillrule: "evenodd",
					fill: "currentcolor",
					d: "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z",
				}),
			]
		);
	}
}
