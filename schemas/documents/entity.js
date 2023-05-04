import { apiVersion } from "../../sanity.client"
import { UserIcon } from "@sanity/icons"

export default {
	name: "entity",
	type: "document",
	title: "Reference",
	icon: UserIcon,
	fields: [
		{
			name: "name",
			type: "string",
			title: "Name",
			description: "",
			validation: (Rule) => Rule.custom(async (value, context) => {
				const { document, getClient } = context
				const id = document._id.replace(/^drafts\./, "")
				const query = `!defined(*[_type == "entity" && !(_id in [$draft, $published]) && lower(name) == $name][0]._id)`
				const params = {
					draft: `drafts.${id}`,
					published: id,
					name: value.toLowerCase(),
				}
				const isUnique = await getClient({apiVersion}).fetch(query, params)
				if (!isUnique) {
					return "Warning: A reference with this name already exists."
				}
				return true
			}).warning(),
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