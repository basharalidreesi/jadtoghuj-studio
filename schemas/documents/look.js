import { ImageIcon } from "@sanity/icons"
import { previewPortableText } from "../../lib/previewPortableText"

export default {
    name: "look",
	type: "document",
	title: "Look",
	icon: ImageIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		},
		{
			name: "display",
			type: "image",
			title: "Display",
			description: "",
			options: {
				metadata: [
					"lqip",
				],
				storeOriginalFilename: false,
			},
		},
		{
			name: "description",
			type: "portableText",
			title: "Description",
			description: "",
		},
	],
	preview: {
		select: {
			title: "title",
			description: "description",
			display: "display",
		},
		prepare(selection) {
			const { title, description, display } = selection
			return {
				title: title,
				subtitle: previewPortableText(description),
				media: display ? display : ImageIcon,
			}
		},
	},
}