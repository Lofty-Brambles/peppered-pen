import { getHighlighter, loadTheme } from "shiki";
import shikiConfig from "@/markdown-manager/plugins/shiki/shiki.css.json";

const SHIKI_PATH =
	"../../../../../src/markdown-manager/plugins/shiki/theme.json";

const getMarker = async () => {
	const theme = await loadTheme(SHIKI_PATH);
	const highlighter = await getHighlighter({ theme });
	highlighter.setColorReplacements(shikiConfig.replacementMap);
	return highlighter;
};

export const marker = await getMarker();
