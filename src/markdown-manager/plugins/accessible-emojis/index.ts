import { nameToEmoji } from "gemoji";
import { Tag } from "@markdoc/markdoc";

export const emoji = Object.fromEntries(
	Object.entries(nameToEmoji).map(([name, emoji]) => [
		name,
		new Tag("span", { role: "image", "aria-label": name }, [emoji]),
	])
);
