import { ImageIcon } from "@sanity/icons"
import { portableTextPreview } from "../../lib/portableTextPreview"

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
		},
		{
			name: "display",
			type: "image",
			title: "Display",
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
				subtitle: portableTextPreview(description),
				media: display ? display : ImageIcon,
			}
		},
	},
}