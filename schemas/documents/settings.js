import { CogIcon } from "@sanity/icons"

export default {
	name: "settings",
	type: "document",
	title: "Settings",
	icon: CogIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
		},
		{
			name: "website",
			type: "website",
			title: "Website",
		},
	],
	preview: {
		select: {
			website: "website",
		},
		prepare(selection) {
			const { website } = selection
			return {
				title: "Settings",
				subtitle: website,
				media: CogIcon,
			}
		},
	},
}