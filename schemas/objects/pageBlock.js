import { DocumentTextIcon } from "@sanity/icons"
import { previewArrayValues } from "../../lib/previewArrayValues"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"

export default {
	name: "pageBlock",
	type: "object",
	title: "Pages",
	icon: DocumentTextIcon,
	fields: [
		{
			name: "pages",
			type: "array",
			title: "Pages",
			of: [
				{
					type: "reference",
					title: "Page",
					to: [{ type: "page" }],
					options: {
						disableNew: true,
						filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
					},
				},
			],
		},
	],
	preview: {
		select: {
			page0: "pages.0.title",
			page1: "pages.1.title",
			page2: "pages.2.title",
			page3: "pages.3.title",
		},
		prepare(selection) {
			const { page0, page1, page2, page3 } = selection
			return {
				title: previewArrayValues(page0, page1, page2, page3),
				subtitle: page1 ? "Pages" : "Page",
			}
		},
	},
}