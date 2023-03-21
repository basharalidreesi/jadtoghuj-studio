import { BookIcon, DocumentTextIcon, EditIcon, HeartIcon, HomeIcon, ImageIcon, TagIcon } from "@sanity/icons"
import { pageIsUniqueLocally } from "../../lib/pageIsUniqueLocally"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"
import { portableTextPreview } from "../../lib/portableTextPreview"

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
		},
		{
			name: "website",
			type: "website",
			title: "Website",
		},
		{
			name: "address",
			type: "slug",
			title: "Address",
			options: {
				source: "title",
				isUnique: pageIsUniqueLocally,
			},
		},
		{
			name: "contents",
			type: "array",
			title: "Contents",
			of: [
				{
					name: "textBlock",
					type: "object",
					title: "Text Block",
					icon: EditIcon,
					fields: [
						{
							name: "text",
							type: "portableText",
							title: "Text",
						},
					],
					preview: {
						select: {
							text: "text",
						},
						prepare(selection) {
							const { text } = selection
							return {
								title: portableTextPreview(text),
								subtitle: "Text Block"
							}
						},
					},
				},
				{
					name: "imageBlock",
					type: "image",
					title: "Image Block",
					icon: ImageIcon,
					preview: {
						select: {
							originalFilename: "asset.originalFilename",
							asset: "asset",
						},
						prepare(selection) {
							const { originalFilename, asset } = selection
							return {
								title: originalFilename,
								subtitle: "Image Block",
								media: asset ? asset : ImageIcon
							}
						},
					}
				},
				{
					name: "projectFeature",
					type: "object",
					title: "Project Feature",
					icon: BookIcon,
					fields: [
						{
							name: "projects",
							type: "array",
							title: "Projects",
							of: [
								{
									type: "reference",
									title: "Project",
									to: [{ type: "project" }],
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
							project0: "projects.0.title",
							project1: "projects.1.title",
							project2: "projects.2.title",
							project3: "projects.3.title",
						},
						prepare(selection) {
							const { project0, project1, project2, project3 } = selection
							const projects = [project0, project1, project2]?.filter(Boolean)?.join(", ") || ""
							return {
								title: project3 ? (projects + ", ...") : projects,
								subtitle: "Project Feature",
							}
						},
					},
				},
				{
					name: "categoryFeature",
					type: "object",
					title: "Category Feature",
					icon: TagIcon,
					fields: [
						{
							name: "categories",
							type: "array",
							title: "Categories",
							of: [
								{
									type: "reference",
									title: "Category",
									to: [{ type: "category" }],
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
							category0: "categories.0.title",
							category1: "categories.1.title",
							category2: "categories.2.title",
							category3: "categories.3.title",
						},
						prepare(selection) {
							const { category0, category1, category2, category3 } = selection
							const categories = [category0, category1, category2]?.filter(Boolean)?.join(", ") || ""
							return {
								title: category3 ? (categories + ", ...") : categories,
								subtitle: "Category Feature",
							}
						},
					},
				},
				{
					name: "campaignFeature",
					type: "object",
					title: "Campaign Feature",
					icon: HeartIcon,
					fields: [
						{
							name: "campaigns",
							type: "array",
							title: "Campaigns",
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
							const campaigns = [campaign0, campaign1, campaign2]?.filter(Boolean)?.join(", ") || ""
							return {
								title: campaign3 ? (campaigns + ", ...") : campaigns,
								subtitle: "Campaign Feature",
							}
						},
					},
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
			website: "website",
		},
		prepare(selection) {
			const { title, address, website } = selection
			return {
				title: title,
				subtitle: website + (address === "/" ? "" : "/") + address + (address === "/" ? "" : "/"),
				media: address === "/" ? HomeIcon : DocumentTextIcon,
			}
		},
	},
}