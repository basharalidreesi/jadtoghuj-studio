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
	],
	preview: {
		select: {
			url: "url",
			title: "title",
			publisher: "publisher",
			datePublished: "datePublished",
		},
		prepare(selection) {
			const {
				url,
				title,
				publisher,
				datePublished,
			} = selection
			return {
				title: title || url,
				subtitle: [publisher || new URL(url)?.hostname?.replace("www.", "") || null, datePublished?.split("-")?.[0]]?.filter(Boolean)?.join(", "),
			}
		},
	},
})