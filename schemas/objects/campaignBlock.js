import { HeartIcon } from "@sanity/icons"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"
import { previewArrayValues } from "../../lib/previewArrayValues"

export default {
	name: "campaignBlock",
	type: "object",
	title: "Campaign",
	icon: HeartIcon,
	fields: [
		{
			name: "campaigns",
			type: "array",
			title: "Campaigns",
			description: "",
			of: [
				{
					type: "reference",
					title: "Campaign",
					to: [{ type: "campaign" }],
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
			campaign0: "campaigns.0.title",
			campaign1: "campaigns.1.title",
			campaign2: "campaigns.2.title",
			campaign3: "campaigns.3.title",
		},
		prepare(selection) {
			const { campaign0, campaign1, campaign2, campaign3 } = selection
			return {
				title: previewArrayValues(campaign0, campaign1, campaign2, campaign3),
				subtitle: "Campaign Block",
			}
		},
	},
}