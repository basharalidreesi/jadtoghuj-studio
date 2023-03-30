import { EditIcon, ImageIcon } from "@sanity/icons"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"
import { previewPortableText } from "../../lib/previewPortableText"
import { previewArrayValues } from "../../lib/previewArrayValues"
import { apiVersion } from "../../sanity.client"

export default {
	name: "project",
	type: "document",
	title: "Project",
	icon: ImageIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		},
		{
			name: "description",
			type: "portableText",
			title: "Description",
			description: "",
		},
		{
			name: "year",
			type: "number",
			title: "Year",
			description: "",
		},
		{
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			options: {
				source: "title",
			},
		},
		{
			name: "isPublic",
			type: "boolean",
			title: "Public",
			description: "Controls whether to publish this project and its contents.",
			initialValue: true,
		},
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
						filter: ({document}) => filterAlreadyReferencedDocuments(document?.categories),
					},
				}
			],
		},
		{
			name: "contributors",
			type: "array",
			title: "Contributors",
			description: "",
			of: [
				{
					name: "contributors",
					type: "object",
					title: "Contributors",
					icon: EditIcon,
					fields: [
						{
							name: "role",
							type: "string",
							title: "Role",
							description: "",
						},
						{
							name: "persons",
							type: "array",
							title: "Person(s)",
							description: "",
							of: [
								{
									type: "reference",
									title: "Person",
									to: [{ type: "person" }],
									options: {
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								},
							],
						},
					],
					preview: {
						select: {
							role: "role",
							person0: "persons.0.name",
							person1: "persons.1.name",
							person2: "persons.2.name",
							person3: "persons.3.name",
						},
						prepare(selection) {
							const { role, person0, person1, person2, person3 } = selection
							return {
								title: previewArrayValues(person0, person1, person2, person3, { prefix: role }),
								media: EditIcon,
							}
						},
					},
				},
			],
		},
		{
			name: "looks",
			type: "array",
			title: "Looks",
			description: "",
			of: [
				{
					type: "reference",
					title: "Look",
					to: [{ type: "look" }],
					options: {
						filter: async ({document, parent, getClient}) => {
							const unreferencedLooks = await getClient({apiVersion}).fetch(`
								*[_type == "look"] {
									_id,
									"refs": count(*[references(^._id)])
								} [refs == 0]._id
							`)
							const usedLooks = document?.lookbook?.map(image => image?.looks?.map(look => look?._ref))?.filter(Boolean)?.flat() || ""
							const existingLooks = parent?.map(look => look._ref)?.filter(Boolean) | ""
							return Promise.resolve({
								filter: '((_id in $usedLooks) && !(_id in $existingLooks)) || _id in $unreferencedLooks',
								params: {
									usedLooks,
									existingLooks,
									unreferencedLooks,
								}
							})
						},
					},
				},
			],
		},
		{
			name: "lookbook",
			type: "array",
			title: "Lookbook",
			description: "",
			of: [
				{
					type: "image",
					title: "Image",
					description: "",
					options: {
						metadata: [
							"lqip",
						],
					},
					fields: [
						{
							name: "looks",
							type: "array",
							title: "Looks in this image",
							description: "",
							of: [
								{
									type: "reference",
									title: "Look",
									to: [{ type: "look" }],
									options: {
										disableNew: true,
										filter: ({document, parent}) => {
											const listedLooks = document?.looks.map(look => look._ref)?.filter(Boolean) || ""
											const existingLooks = parent?.map(look => look._ref)?.filter(Boolean) || ""
											return {
												filter: '(_id in $listedLooks) && !(_id in $existingLooks)',
												params: {
													listedLooks,
													existingLooks,
												}
											}
										},
									},
								},
							],
						},
						{
							name: "caption",
							type: "portableText",
							title: "Caption",
							description: "",
						},
					],
					preview: {
						select: {
							originalFilename: "asset.originalFilename",
							look0: "looks.0.title",
							look1: "looks.1.title",
							look2: "looks.2.title",
							look3: "looks.3.title",
							ref0: "looks.0._ref",
							ref1: "looks.1._ref",
							ref2: "looks.2._ref",
							ref3: "looks.3._ref",
							caption: "caption",
							asset: "asset",
						},
						prepare(selection) {
							const { originalFilename, look0, look1, look2, look3, ref0, ref1, ref2, ref3, caption, asset } = selection
							return {
								title: previewArrayValues(look0, look1, look2, look3, {
									prefix: originalFilename,
									begin: " (",
									end: ")",
									ref0: ref0,
									ref1: ref1,
									ref2: ref2,
									ref3: ref3,
									untitled: "Untitled Look",
								}),
								subtitle: previewPortableText(caption),
								media: asset ? asset : ImageIcon,
							}
						},
					},
				},
			],
		},
	],
	orderings: [
		{
			title: "year (new → old)",
			name: "yearDesc",
			by: [
				{
					field: "year",
					direction: "desc",
				},
				{
					field: "title",
					direction: "asc",
				},
			],
		},
	],
	preview: {
		select: {
			title: "title",
			description: "description",
			isPublic: "isPublic",
			asset0: "lookbook.0.asset"
		},
		prepare(selection) {
			const { title, description, isPublic, asset0 } = selection
			return {
				title: isPublic ? title : (title ? ("🔒 " + title) : ""),
				subtitle: previewPortableText(description),
				media: asset0 ? asset0 : ImageIcon,
			}
		},
	},
}