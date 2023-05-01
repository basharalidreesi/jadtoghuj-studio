import { IceCreamIcon } from "@sanity/icons"
import { previewPortableText } from "../../lib/previewPortableText"

export default {
	name: "look",
	type: "document",
	title: "Look",
	icon: IceCreamIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		},
		{
			name: "image",
			type: "image",
			title: "Image",
			description: "",
			options: {
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
			image: "image",
		},
		prepare(selection) {
			const { title, description, image } = selection
			return {
				title: title,
				subtitle: previewPortableText(description),
				media: image ? image : IceCreamIcon,
			}
		},
	},
}