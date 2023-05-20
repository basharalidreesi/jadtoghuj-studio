import { defineField, defineType } from "sanity"
import { checkIfValueAlreadyExistsInType } from "../../lib"
import { TagIcon } from "@sanity/icons"

export default defineType({
	name: "category",
	type: "document",
	title: "Category",
	icon: TagIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueAlreadyExistsInType).warning(),
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
		},
		prepare(selection) {
			const { title } = selection
			return {
				title: title,
			}
		},
	},
})