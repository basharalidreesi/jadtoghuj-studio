import { defineField } from "sanity";

export const styles = {
	normal: {
		value: "normal",
		title: "Normal",
	},
};

export const lists = {
	bullets: {
		value: "bullet",
		title: "Bullets",
	},
	numbers: {
		value: "number",
		title: "Numbers",
	},
};

export const decorators = {
	strong: {
		value: "strong",
		title: "Bold",
	},
	em: {
		value: "em",
		title: "Italic",
	},
	underline: {
		value: "underline",
		title: "Underline",
	},
	strikeThrough: {
		value: "strike-through",
		title: "Strikethrough",
	},
};

export const annotations = {
	link: defineField({
		name: "link",
		type: "link",
		title: "Link",
	}),
};

export const portableTextToPlainText = (blocks = []) => {
	return blocks.map((block) => {
		// @ts-ignore
		if (block._type !== "block" || !block.children) {
			return "";
		};
		// @ts-ignore
		return block.children.map((child) => child.text).join("");
	}).join("\n\n");
};