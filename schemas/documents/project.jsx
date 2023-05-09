import { useEffect, useState } from "react"
import { FormField, defineArrayMember, defineField, defineType, useFormValue } from "sanity"
import useSanityClient, { apiVersion } from "../../sanity.client"
import { ColourPreview, ExposedArrayFunctions, InputWithPrefixOrSuffix, VideoPreview } from "../../components"
import { checkIfValueAlreadyExistsInType, filterAlreadyReferencedDocuments, previewArrayValues, previewPortableText } from "../../lib"
import { Box, Flex, Text, TextInput } from "@sanity/ui"
import { DatabaseIcon, ImageIcon, PlayIcon, UserIcon, UsersIcon } from "@sanity/icons"

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
			validation: (Rule) => Rule.custom(checkIfValueAlreadyExistsInType).warning(),
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
			options: {
				source: "title",
			},
			hidden: ({document}) => !document?.isPublic,
			components: {
				input: (props) => <InputWithPrefixOrSuffix options={{ prefix: { fromDocument: "settings", fromFields: ["url", "basePath", "projectPath"] }, suffix: {fromString: "/"} }} {...props} />,
			},
		}),
		defineField({
			name: "categories",
			type: "array",
			title: "Categories",
			description: "",
			of: [
				defineArrayMember({
					type: "reference",
					title: "Category",
					to: [{ type: "category" }],
					options: {
						filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
					},
				}),
			],
			validation: (Rule) => Rule.unique().warning("Duplicate categories found."),
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
				defineArrayMember({
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
								defineArrayMember({
									type: "reference",
									title: "Reference",
									to: [{ type: "entity" }],
									options: {
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								}),
							],
							validation: (Rule) => Rule.unique().warning("Duplicate contributors found."),
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
			validation: (Rule) => Rule.unique().warning("Duplicate contributions found."),
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
				defineArrayMember({
					type: "reference",
					title: "Look",
					to: [{ type: "look" }],
					options: {
						filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
					},
				}),
			],
			validation: (Rule) => Rule.unique().warning("Duplicate looks found."),
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
				defineArrayMember({
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
				defineArrayMember({
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
								input: (props) => <VideoPreview options={{ withDefault: true, from: props.value, as: "iframe" }} {...props} />,
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
								media: url ? <VideoPreview options={{ from: url, as: "img" }} /> : null,
							}
						},
					},
				}),
			],
			validation: (Rule) => Rule.unique().warning("Duplicate entries found."),
			components: {
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "colour",
			type: "string",
			title: "Colour",
			description: "",
			components: {
				field: LookbookColourPreview,
				input: (props) => <ColourPreview options={{ withDefault: true, colour: props.value, placeholder: "#ffffff", }} {...props} />,
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
				media: lookbook0Asset ? lookbook0Asset : (lookbook0Video ? <VideoPreview options={{ from: lookbook0Video, as: "img" }} /> : null),
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
			defineArrayMember({
				type: "reference",
				title: "Look",
				to: [{ type: "look" }],
				options: {
					disableNew: true,
					filter: ({document, parent}) => {
						const specifiedLooks = document?.looks?.map((look) => look._ref)?.filter(Boolean) || ""
						const alreadyReferencedLooks = parent?.map((look) => look._ref)?.filter(Boolean) || ""
						return {
							filter: `(_id in $specifiedLooks) && !(_id in $alreadyReferencedLooks)`,
							params: {
								specifiedLooks,
								alreadyReferencedLooks,
							}
						}
					},
				},
			}),
		],
		validation: (Rule) => [
			Rule.unique().warning("Duplicate looks found."),
		],
		components: {
			input: ExposedArrayFunctions,
		},
	})
}

function LookbookColourPreview(props) {
	const [colour, setColour] = useState("")
	const hasCustomColour = useFormValue(["hasCustomColour"])
	const lookbook = useFormValue(["lookbook"])
	const image0 = lookbook && lookbook[0]._type === "image" && lookbook[0].asset ? lookbook[0] : null
	const ref = image0?.asset?._ref
	const client = useSanityClient()
	useEffect(() => {
		async function getDefaultBackgroundColour() {
			const defaultBackgroundColour = await client.fetch(`*[_type == "settings"].colours.bottom`).then(console.info("Fetching default background colour."))
			setColour(defaultBackgroundColour)
		}
		async function getDominantBackgroundColour() {
			const dominantBackgroundColour = await client.fetch(`*[_id == "${ref}"].metadata.palette.dominant.background`).then(console.info("Fetching dominant background colour."))
			setColour(dominantBackgroundColour)
		}
		if (image0) {
			getDominantBackgroundColour()
		} else {
			getDefaultBackgroundColour()
		}
	}, [ref])
	if (hasCustomColour) {
		return props.renderDefault(props)
	}
	return (
		<FormField title={props.schemaType.title} description={props.schemaType.description} inputId={"lookbook-with-colour-preview"}>
			<Flex direction="row" wrap="nowrap" gap={1}>
				<ColourPreview options={{ colour: colour, inputId: "lookbook-with-colour-preview" }} />
				<Box flex={3}>
					<TextInput value={colour} id={"lookbook-with-colour-preview"} readOnly />
				</Box>
			</Flex>
		</FormField>
	)
}