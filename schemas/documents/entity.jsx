import { defineField, defineType } from "sanity"
import { checkIfValueAlreadyExistsInType } from "../../lib"
import { UserIcon } from "@sanity/icons"

export default defineType({
	name: "entity",
	type: "document",
	title: "Entity",
	icon: UserIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Name",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueAlreadyExistsInType).info(),
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "",
		}),
	],
	orderings: [
		{
			title: "name (a → z)",
			name: "nameAsc",
			by: [
				{
					field: "name",
					direction: "asc",
				},
			],
		},
	],
	preview: {
		select: {
			name: "name",
		},
		prepare(selection) {
			const { name } = selection
			return {
				title: name,
			}
		},
	},
})