import { UserIcon } from "@sanity/icons"

export default {
	name: "person",
	type: "document",
	title: "Person",
	icon: UserIcon,
	fields: [
		{
			name: "name",
			type: "string",
			title: "Name",
			description: "",
		},
		{
			name: "url",
			type: "url",
			title: "URL",
			description: "",
		},
	],
	orderings: [
		{
			title: "name (a → z)",
			name: "nameAsc",
			by: [
				{
					field: "name",
					direction: "asc",
				}
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
				media: UserIcon,
			}
		},
	},
}