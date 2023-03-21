import { TagIcon } from "@sanity/icons"

export default {
	name: "category",
	type: "document",
	title: "Category",
	icon: TagIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		},
	],
	orderings: [
		{
			title: "title (a → z)",
			name: "titleAsc",
			by: [
				{
					field: "title",
					direction: "asc",
				}
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
				media: TagIcon,
			}
		},
	},
}