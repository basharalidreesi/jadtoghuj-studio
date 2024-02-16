import { defineField } from "sanity";
import { EditIcon } from "@sanity/icons";

const portableTextConfig = {
	PORTABLE_TEXT_ICON: EditIcon,
	styles: {
		normal: {
			value: "normal",
			title: "Normal",
		},
	},
	decorators: {
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
		sup: {
			value: "sup",
			title: "Superscript",
			icon: () => (<>
				<span>
					x<sup style={{ fontSize: "0.6em" }}>2</sup>
				</span>
			</>),
			component: (props: any) => (<>
				<span style={{ fontSize: "0.8em" }}>
					<sup>{props.children}</sup>
				</span>
			</>),
		},
	},
	annotations: {
		link: defineField({
			name: "link",
			type: "link",
			title: "Link",
		}),
	},
	renderAsPlainText: (blocks: any) => {
		if (typeof blocks === "string") { return blocks; };
		return blocks?.map((block: any) => {
			if (block._type !== "block" || !block.children) {
				return `[${block._type} block]`;
			};
			return block.children.map((child: any) => child.text).join("");
		}).join("\n\n") || "";
	},
};

export default portableTextConfig;