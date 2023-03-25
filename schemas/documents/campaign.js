import { HeartIcon } from "@sanity/icons"

export default {
	name: "campaign",
	type: "document",
	title: "Campaign",
	icon: HeartIcon,
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
			title: "created (new → old)",
			name: "createdDesc",
			by: [
				{
					field: "_createdAt",
					direction: "desc",
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
				media: HeartIcon,
			}
		},
	},
}