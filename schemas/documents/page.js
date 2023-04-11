import { DocumentTextIcon, HomeIcon } from "@sanity/icons"
import { isLocallyUnique } from "../../lib/isLocallyUnique"

export default {
	name: "page",
	type: "document",
	title: "Page",
	icon: DocumentTextIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		},
		{
			name: "website",
			type: "website",
			title: "Website",
			description: "",
		},
		{
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			options: {
				source: "title",
				isUnique: isLocallyUnique,
			},
		},
		{
			name: "contents",
			type: "array",
			title: "Contents",
			description: "",
			of: [
				{
					name: "textBlock",
					type: "textBlock",
					title: "Text",
				},
				{
					name: "imageBlock",
					type: "imageBlock",
					title: "Image",
				},
				{
					name: "lookBlock",
					type: "lookBlock",
					title: "Look",
				},
				{
					name: "projectBlock",
					type: "projectBlock",
					title: "Project",
				},
				{
					name: "categoryBlock",
					type: "categoryBlock",
					title: "Category",
				},
				{
					name: "campaignBlock",
					type: "campaignBlock",
					title: "Campaign",
				},
			],
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
			address: "address.current",
		},
		prepare(selection) {
			const { title, address } = selection
			return {
				title: title,
				subtitle: "..." + (address === "/" ? "" : "/") + address + (address === "/" ? "" : "/"),
				media: address === "/" ? HomeIcon : DocumentTextIcon,
			}
		},
	},
}