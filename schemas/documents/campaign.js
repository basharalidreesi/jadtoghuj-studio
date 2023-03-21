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
}