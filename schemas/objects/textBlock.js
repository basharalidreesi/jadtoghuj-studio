import { EditIcon } from "@sanity/icons"
import { previewPortableText } from "../../lib/previewPortableText"

export default {
	name: "textBlock",
	type: "object",
	title: "Text",
	icon: EditIcon,
	fields: [
		{
			name: "text",
			type: "portableText",
			title: "Text",
			description: "",
		},
	],
	preview: {
		select: {
			text: "text",
		},
		prepare(selection) {
			const { text } = selection
			return {
				title: previewPortableText(text),
				subtitle: "Text"
			}
		},
	},
}