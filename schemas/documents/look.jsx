import { defineField, defineType, useFormValue } from "sanity"
import { previewPortableText } from "../../lib"
import { SparklesIcon } from "@sanity/icons"
import useSanityClient from "../../sanity.client"

export default defineType({
	name: "look",
	type: "document",
	title: "Look",
	icon: SparklesIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		}),
		defineField({
			name: "image",
			type: "image",
			title: "Image",
			description: "",
			options: {
				storeOriginalFilename: false,
			},
		}),
		defineField({
			name: "description",
			type: "portableText",
			title: "Description",
			description: "",
		}),
	],
	orderings: [
		{
			title: "title (a → z)",
			name: "titleAsc",
			by: [
				{
					field: "title",
					direction: "asc",
				},
			],
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
				media: image,
			}
		},
	},
})