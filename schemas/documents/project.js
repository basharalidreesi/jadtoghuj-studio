import { BookIcon, EditIcon, ImageIcon } from "@sanity/icons"
import { filterAlreadyReferencedDocuments } from "../../lib/filterAlreadyReferencedDocuments"
import { previewPortableText } from "../../lib/previewPortableText"
import { previewArrayValues } from "../../lib/previewArrayValues"
import { apiVersion } from "../../sanity.client"

export default {
	name: "project",
	type: "document",
	title: "Project",
	icon: BookIcon,
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
								title: previewArrayValues(person0, person1, person2, person3, { prefix: role, }),
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
							const usedLooks = document?.lookbook?.map(image => image?.looks?.map(look => look?._ref))?.filter(Boolean)?.flat()
							const existingLooks = parent?.map(look => look._ref)?.filter(Boolean)
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
											const listedLooks = document?.looks.map(look => look._ref)?.filter(Boolean)
											const existingLooks = parent?.map(look => look._ref)?.filter(Boolean)
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
							look0Title: "looks.0.title",
							look0Asset: "looks.0.display.asset",
							look1Title: "looks.1.title",
							look1Asset: "looks.1.display.asset",
							look2Title: "looks.2.title",
							look2Asset: "looks.2.display.asset",
							look3Asset: "looks.3.display.asset",
							caption: "caption",
							asset: "asset",
						},
						prepare(selection) {
							const { originalFilename, look0Title, look0Asset, look1Title, look1Asset, look2Title, look2Asset, look3Asset, caption, asset } = selection
							const looks = [look0Asset ? (look0Title ? look0Title : "Untitled") : "", look1Asset ? (look1Title ? look1Title : "untitled") : "", look2Asset ? (look2Title ? look2Title : "untitled") : ""]?.filter(Boolean)?.join(", ") || ""
							return {
								title: originalFilename + (looks ? (" (" + (look3Asset ? looks + ", ..." : looks) + ")") : ""),
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
			asset0: "lookbook.0.asset"
		},
		prepare(selection) {
			const { title, description, asset0 } = selection
			return {
				title: title,
				subtitle: previewPortableText(description),
				media: asset0 ? asset0 : BookIcon,
			}
		},
	},
}