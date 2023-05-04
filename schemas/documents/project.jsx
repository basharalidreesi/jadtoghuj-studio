import { useEffect, useState } from "react"
import { defineField, defineType, useFormValue } from "sanity"
import client, { apiVersion } from "../../sanity.client"
import { ColouredInput, ExposedArrayFunctions, PrefixedInput, VideoPreview } from "../../components"
import { filterAlreadyReferencedDocuments, previewArrayValues, previewPortableText } from "../../lib"
import { DatabaseIcon, ImageIcon, PlayIcon, UserIcon, UsersIcon } from "@sanity/icons"
import { Box, Card, Flex, Text, TextInput } from "@sanity/ui"

export default defineType({
	name: "project",
	type: "document",
	title: "Project",
	icon: DatabaseIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		}),
		defineField({
			name: "description",
			type: "portableText",
			title: "Description",
			description: "",
		}),
		defineField({
			name: "year",
			type: "number",
			title: "Year",
			description: "",
		}),
		defineField({
			name: "isPublic",
			type: "boolean",
			title: "Public",
			description: "",
			initialValue: true,
		}),
		defineField({
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			components: {
				input: (props) => <PrefixedInput source={"settings"} prefix={["url", "basePath", "projectPath"]} suffix={"/"} {...props} />,
			},
			options: {
				source: "title",
			},
			hidden: ({document}) => !document?.isPublic,
		}),
		defineField({
			name: "categories",
			type: "array",
			title: "Categories",
			description: "",
			of: [
				defineField({
					type: "reference",
					title: "Category",
					to: [{ type: "category" }],
					options: {
						filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
					},
				}),
			],
			components: {
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "contributions",
			type: "array",
			title: "Contributions",
			description: "",
			of: [
				defineField({
					name: "contribution",
					type: "object",
					title: "Contribution",
					icon: UserIcon,
					fields: [
						defineField({
							name: "contribution",
							type: "string",
							title: "Contribution",
							description: "",
						}),
						defineField({
							name: "contributors",
							type: "array",
							title: "Contributors",
							description: "",
							of: [
								defineField({
									type: "reference",
									title: "Reference",
									to: [{ type: "entity" }],
									options: {
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								}),
							],
							components: {
								input: ExposedArrayFunctions,
							},
						}),
					],
					preview: {
						select: {
							contribution: "contribution",
							contributor0Name: "contributors.0.name",
							contributor1Name: "contributors.1.name",
							contributor2Name: "contributors.2.name",
							contributor3Name: "contributors.3.name",
						},
						prepare(selection) {
							const {
								contribution,
								contributor0Name,
								contributor1Name,
								contributor2Name,
								contributor3Name,
							} = selection
							return {
								title: previewArrayValues(
									contributor0Name,
									contributor1Name,
									contributor2Name,
									contributor3Name,
									{ prefix: contribution },
								),
								media: contributor1Name ? UsersIcon : null,
							}
						},
					},
				}),
			],
			components: {
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "looks",
			type: "array",
			title: "Looks",
			description: "",
			of: [
				defineField({
					type: "reference",
					title: "Look",
					to: [{ type: "look" }],
					options: {
						filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
						// filter: async ({document, parent, getClient}) => {
						// 	const unreferencedLooks = await getClient({apiVersion}).fetch(`
						// 		*[_type == "look"] {
						// 			_id,
						// 			"refs": count(*[references(^._id)])
						// 		} [refs == 0]._id
						// 	`)
						// 	const usedLooks = document?.lookbook?.map(image => image?.looks?.map(look => look?._ref))?.filter(Boolean)?.flat() || ""
						// 	const existingLooks = parent?.map(look => look._ref)?.filter(Boolean) | ""
						// 	return Promise.resolve({
						// 		filter: '((_id in $usedLooks) && !(_id in $existingLooks)) || _id in $unreferencedLooks',
						// 		params: {
						// 			usedLooks,
						// 			existingLooks,
						// 			unreferencedLooks,
						// 		}
						// 	})
						// },
					},
				}),
			],
			components: {
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "lookbook",
			type: "array",
			title: "Lookbook",
			description: "",
			of: [
				defineField({
					name: "image",
					type: "image",
					title: "Image",
					description: "",
					icon: ImageIcon,
					fields: [featuredLooks()],
					preview: {
						select: {
							asset: "asset",
							assetOriginalFilename: "asset.originalFilename",
							featuredLook0Title: "featuredLooks.0.title",
							featuredLook1Title: "featuredLooks.1.title",
							featuredLook2Title: "featuredLooks.2.title",
							featuredLook3Title: "featuredLooks.3.title",
							featuredLook0Ref: "featuredLooks.0._ref",
							featuredLook1Ref: "featuredLooks.1._ref",
							featuredLook2Ref: "featuredLooks.2._ref",
							featuredLook3Ref: "featuredLooks.3._ref",
						},
						prepare(selection) {
							const {
								asset,
								assetOriginalFilename,
								featuredLook0Title,
								featuredLook1Title,
								featuredLook2Title,
								featuredLook3Title,
								featuredLook0Ref,
								featuredLook1Ref,
								featuredLook2Ref,
								featuredLook3Ref,
							} = selection
							return {
								title: previewArrayValues(
									featuredLook0Title,
									featuredLook1Title,
									featuredLook2Title,
									featuredLook3Title,
									{
										ref0: featuredLook0Ref,
										ref1: featuredLook1Ref,
										ref2: featuredLook2Ref,
										ref3: featuredLook3Ref,
										prefix: assetOriginalFilename,
										prepend: " (",
										append: ")",
										untitledLabel: "Untitled Look",
									}
								),
								media: asset ? asset : null,
							}
						},
					},
				}),
				defineField({
					name: "video",
					type: "object",
					title: "Video",
					icon: PlayIcon,
					fields: [
						defineField({
							name: "url",
							type: "url",
							title: "URL",
							description: "",
							components: {
								input: (props) => <VideoPreview withDefault={true} url={props.value} target={"iframe"} {...props} />,
							},
						}),
						featuredLooks(),
					],
					preview: {
						select: {
							url: "url",
							featuredLook0Title: "featuredLooks.0.title",
							featuredLook1Title: "featuredLooks.1.title",
							featuredLook2Title: "featuredLooks.2.title",
							featuredLook3Title: "featuredLooks.3.title",
							featuredLook0Ref: "featuredLooks.0._ref",
							featuredLook1Ref: "featuredLooks.1._ref",
							featuredLook2Ref: "featuredLooks.2._ref",
							featuredLook3Ref: "featuredLooks.3._ref",
						},
						prepare(selection) {
							const {
								url,
								featuredLook0Title,
								featuredLook1Title,
								featuredLook2Title,
								featuredLook3Title,
								featuredLook0Ref,
								featuredLook1Ref,
								featuredLook2Ref,
								featuredLook3Ref,
							} = selection
							return {
								title: previewArrayValues(
									featuredLook0Title,
									featuredLook1Title,
									featuredLook2Title,
									featuredLook3Title,
									{
										ref0: featuredLook0Ref,
										ref1: featuredLook1Ref,
										ref2: featuredLook2Ref,
										ref3: featuredLook3Ref,
										prefix: url,
										prepend: " (",
										append: ")",
										untitledLabel: "Untitled Look",
									}
								),
								media: url ? <VideoPreview url={url} target={"img"} /> : null,
							}
						},
					},
				}),
			],
			components: {
				field: LookbookWithColourPreview,
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "colour",
			type: "string",
			title: "Colour",
			description: "",
			initialValue: "#ffffff",
			hidden: ({parent}) => !parent?.hasCustomColour,
			components: {
				input: ColouredInput,
			},
		}),
		defineField({
			name: "hasCustomColour",
			type: "boolean",
			title: "Custom Colour",
			description: "",
			initialValue: false,
		}),
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
			lookbook0Asset: "lookbook.0.asset",
			lookbook0Video: "lookbook.0.url",
		},
		prepare(selection) {
			const {
				title,
				description,
				isPublic,
				lookbook0Asset,
				lookbook0Video,
			} = selection
			return {
				title: isPublic ? title : (title ? ("🔒 " + title) : null),
				subtitle: previewPortableText(description),
				media: lookbook0Asset ? lookbook0Asset : (lookbook0Video ? <VideoPreview url={lookbook0Video} target={"img"} /> : null),
			}
		},
	},
})

function featuredLooks() {
	return defineField({
		name: "featuredLooks",
		type: "array",
		title: "Featured Looks",
		description: "",
		of: [
			defineField({
				type: "reference",
				title: "Look",
				to: [{ type: "look" }],
				options: {
					disableNew: true,
					filter: ({document, parent}) => {
						const specifiedLooks = document?.looks?.map(look => look._ref)?.filter(Boolean) || ""
						const alreadyExistingLooks = parent?.map(look => look._ref)?.filter(Boolean) || ""
						return {
							filter: '(_id in $specifiedLooks) && !(_id in $alreadyExistingLooks)',
							params: {
								specifiedLooks,
								alreadyExistingLooks,
							}
						}
					},
				},
			}),
		],
		components: {
			input: ExposedArrayFunctions,
		},
	})
}

function LookbookWithColourPreview(props) {
	const lookbook = useFormValue(["lookbook"])
	const image0 = lookbook && lookbook[0]._type === "image" && lookbook[0].asset ? lookbook[0] : null
	const ref = image0 ? image0.asset._ref : "null"
	const [colour, setColour] = useState(0)
	useEffect(() => {
		async function getDefaultBackgroundColour() {
			const defaultBackgroundColour = await client.fetch(`*[_type == "settings"].colours.bottom`)
			setColour(defaultBackgroundColour)
		}
		async function getDominantBackgroundColour() {
			const dominantBackgroundColour = await client.fetch(`*[_id == "${ref}"].metadata.palette.dominant.background`)
			setColour(dominantBackgroundColour)
		}
		if (image0) {
			getDominantBackgroundColour()
		} else {
			getDefaultBackgroundColour()
		}
	}, [ref])
	return useFormValue(["hasCustomColour"]) === true
		? props.renderDefault(props)
		: (
			<>
				{props.renderDefault(props)}
				<Box>
					<Box paddingTop={2} paddingBottom={3}>
						<Text size={1} weight="semibold">
							<label htmlFor="lookbook-colour-preview">
								Colour
							</label>
						</Text>
					</Box>
					<Flex direction="row" wrap="nowrap">
						<Card sizing="border" flex={1} marginRight={2} border="true" style={{ borderRadius: "0.0625rem", background: "transparent", }}>
							<label htmlFor="lookbook-colour-preview" style={{ display: "block", width: "100%", height: "100%", background: colour }}></label>
						</Card>
						<Box flex={3}>
							<TextInput value={colour} id="lookbook-colour-preview" readOnly />
						</Box>
					</Flex>
				</Box>
			</>
		)
}