import type { RenderableTreeNode, Scalar } from "@markdoc/markdoc";
import { Tag } from "@markdoc/markdoc";
import readingTime from "reading-time";
import { CONSTANTS } from "@/utilities/env";

type Node = RenderableTreeNode;

export class ReadingTimeManager {
	public static navigate(node: Node) {
		const text = this._worker(node) ?? "";
		const { minutes, time } = readingTime(text, {
			wordsPerMinute: +CONSTANTS.readSpeed,
		});
		return { minutes, time };
	}

	private static _worker(node: Node) {
		if (!Tag.isTag(node)) return;
		let text = "";

		// iterative pre order traversal of the tree to fetch all words
		const queue: Tag[] = [node];
		while (queue.length !== 0) {
			const tempQueue: Tag[] = [];
			const tag = queue.pop()!;

			if (tag.children.length === 0) break;
			tag.children.forEach((child) => {
				if (!Tag.isTag(child)) text += this._getString(child);
				else tempQueue.push(child);
			});

			queue.push(...tempQueue.reverse());
		}

		return text;
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
}
