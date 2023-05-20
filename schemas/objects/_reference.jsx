import { LinkIcon } from "@sanity/icons"
import { defineField } from "sanity"
import { TitleFromUrl } from "../../components/"

export default defineField({
	name: "_reference",
	type: "object",
	title: "Reference",
	icon: LinkIcon,
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
			components: {
				input: TitleFromUrl,
			},
		}),
	],
	preview: {
		select: {
			url: "url",
			title: "title",
		},
		prepare(selection) {
			const { url, title } = selection
			var subtitle = null
			try {
				subtitle = new URL(url)?.hostname?.replace("www.", "")
			} catch {}
			return {
				title: title || url || null,
				subtitle: subtitle,
			}
		},
	},
})