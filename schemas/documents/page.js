import { BookIcon, DocumentTextIcon, EditIcon, HeartIcon, HomeIcon, ImageIcon, TagIcon } from "@sanity/icons"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"
import { isLocallyUnique } from "../../lib/isLocallyUnique"
import { previewArrayValues } from "../../lib/previewArrayValues"
import { previewPortableText } from "../../lib/previewPortableText"

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
					type: "object",
					title: "Text",
					icon: EditIcon,
					fields: [
						{
							name: "text",
							type: "portableText",
							title: "Text",
							description: "",
						},
					],
					preview: {
						select: {
							text: "text",
						},
						prepare(selection) {
							const { text } = selection
							return {
								title: previewPortableText(text),
								subtitle: "Text Block"
							}
						},
					},
				},
				{
					name: "imageBlock",
					type: "image",
					title: "Image",
					description: "",
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
					name: "projectBlock",
					type: "object",
					title: "Project",
					icon: BookIcon,
					fields: [
						{
							name: "projects",
							type: "array",
							title: "Projects",
							description: "",
							of: [
								{
									type: "reference",
									title: "Project",
									to: [{ type: "project" }],
									options: {
										disableNew: true,
										filter: async ({parent}) => {
											const referencedProjects = parent?.map(doc => doc._ref)?.filter(Boolean) || ""
											return {
												filter: '!(_id in $referencedProjects) && isPublic == true',
												params: {
													referencedProjects,
												}
											}
										},
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
							return {
								title: previewArrayValues(project0, project1, project2, project3),
								subtitle: "Project Block",
							}
						},
					},
				},
				{
					name: "categoryBlock",
					type: "object",
					title: "Category",
					icon: TagIcon,
					fields: [
						{
							name: "categories",
							type: "array",
							title: "Categories",
							description: "",
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
							return {
								title: previewArrayValues(category0, category1, category2, category3),
								subtitle: "Category Block",
							}
						},
					},
				},
				{
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