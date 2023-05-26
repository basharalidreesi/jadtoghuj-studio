import { IceCreamIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
	name: "press",
	type: "document",
	title: "Press",
	icon: IceCreamIcon,
	fields: [
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "",
		}),
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		}),
		defineField({
			name: "publisher",
			type: "string",
			title: "Publisher",
			description: "",
		}),
		defineField({
			name: "datePublished",
			type: "date",
			title: "Date Published",
			description: "",
			options: {
				dateFormat: "MMMM D, YYYY",
			},
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
	],
	orderings: [
		{
			title: "date published (new → old)",
			name: "datePublishedDesc",
			by: [
				{
					field: "datePublished",
					direction: "desc",
				},
				{
					field: "publisher",
					direction: "asc",
				},
				{
					field: "title",
					direction: "asc",
				},
			],
		},
	],
	preview: {
		select: {
			url: "url",
			title: "title",
			publisher: "publisher",
			datePublished: "datePublished",
			image: "image"
		},
		prepare(selection) {
			const {
				url,
				title,
				publisher,
				datePublished,
				image,
			} = selection
			var hostname = null
			if (!publisher) {
				try {
					hostname = new URL(url)?.hostname?.replace("www.", "")
				} catch {}
			}
			return {
				title: title || url,
				subtitle: [publisher || hostname, datePublished?.split("-")?.[0]]?.filter(Boolean)?.join(", "),
				media: image,
			}
		},
	},
})