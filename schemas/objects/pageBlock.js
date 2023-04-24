import { DocumentTextIcon } from "@sanity/icons"

export default {
	name: "pageBlock",
	type: "object",
	title: "Page",
	icon: DocumentTextIcon,
	fields: [
		{
			name: "page",
			type: "reference",
			title: "Page",
			to: [{ type: "page" }],
			options: {
				disableNew: true,
			},
		},
	],
	preview: {
		select: {
			title: "page.title",
		},
		prepare(selection) {
			const { title } = selection
			return {
				title: title,
				subtitle: "Page",
			}
		},
	},
}