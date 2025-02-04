import { defineField, PortableTextBlock, PortableTextChild } from "sanity";

export const portableTextStyles = {
	normal: {
		value: "normal",
		title: "Normal",
	},
};

export const portableTextLists = {
	bullets: {
		value: "bullet",
		title: "Bullets",
	},
	numbers: {
		value: "number",
		title: "Numbers",
	},
};

export const portableTextDecorators = {
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

export const portableTextAnnotations = {
	link: defineField({
		name: "link",
		type: "link",
		title: "Link",
	}),
};

export const portableTextToPlainText = (blocks: PortableTextBlock[] = []) => {
	return blocks?.map((block) => {
		if (block._type !== "block" || !block.children) {
			return "";
		};
		// @ts-ignore
		return block.children?.map((child: PortableTextChild) => child.text).join("");
	}).join("\n\n");
};