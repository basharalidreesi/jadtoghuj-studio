import { defineArrayMember, defineField, defineType } from "sanity"
import { apiVersion } from "../../sanity.client"
import { ExposedArrayFunctions, InputWithPrefixOrSuffix } from "../../components"
import { customSlugify, filterAlreadyReferencedDocuments, previewArrayValues, previewPortableText } from "../../lib"
import { BillIcon, DatabaseIcon, EditIcon, HomeIcon, IceCreamIcon, ImageIcon, LeaveIcon, SparklesIcon, TagIcon } from "@sanity/icons"

export default defineType({
	name: "page",
	type: "document",
	title: "Page",
	icon: BillIcon,
	fieldsets: [
		{
			name: "colourSettings",
			title: "Colour Settings",
			options: {
				columns: 2,
			},
		},
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
		}),
		defineField({
			name: "target",
			type: "string",
			title: "Target",
			description: "",
			options: {
				list: [
					{
						value: "internal",
						title: "Internal",
					},
					{
						value: "external",
						title: "External",
					},
				],
				layout: "radio",
			},
			initialValue: "internal",
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "",
			hidden: ({document}) => document?.target && document?.target === "external" ? false : true
		}),
		defineField({
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			options: {
				source: "title",
				slugify: customSlugify,
			},
			components: {
				input: (props) => <InputWithPrefixOrSuffix options={{ prefix: { fromDocument: "settings", fromFields: ["url", "basePath"] }, suffix: {fromString: "/"} }} {...props} />,
			},
			readOnly: ({document}) => ["homepage", "drafts.homepage"].includes(document._id) ? true : false,
			hidden: ({document}) => document?.target && document?.target === "internal" ? false : true,
		}),
		defineField({
			name: "content",
			type: "array",
			title: "Content",
			description: "",
			of: [
				textBlock(),
				imageBlock(),
				pressBlock(),
				pageBlock(),
				lookBlock(),
				projectBlock(),
				categoryBlock(),
			],
			options: {
				exposedArrayOptions: {
					withDefault: true,
				},
			},
			components: {
				input: ExposedArrayFunctions,
			},
			hidden: ({document}) => document?.target && document?.target === "internal" ? false : true,
		}),
		defineField({
			name: "hasCustomColours",
			type: "boolean",
			title: "Custom Colours",
			description: "",
			initialValue: false,
			fieldset: "colourSettings",
			hidden: ({document}) => document?.target && document?.target === "internal" ? false : true,
		}),
		defineField({
			name: "doesAllowTinting",
			type: "boolean",
			title: "Allow Tinting",
			description: "",
			initialValue: true,
			fieldset: "colourSettings",
			hidden: ({document}) => document?.target && document?.target === "internal" ? false : true,
		}),
		defineField({
			name: "colours",
			type: "gradient",
			title: "Colours",
			description: "",
			hidden: ({document}) => !document?.hasCustomColours,
		}),
	],
	components: {
		input: (props) => {
			return (
				<>
					<style>{`
						fieldset[data-testid="fieldset-colourSettings"] > *:first-child {
							display: none !important;
						}
						fieldset[data-testid="fieldset-colourSettings"] > *:nth-child(2) {
							border-left: none !important;
							padding-left: 0 !important;
						}
						fieldset[data-testid="field-colours"] > *:nth-child(2) {
							border: 1px solid var(--card-border-color) !important;
							padding-inline: 0.75rem !important;
							padding-top: 0.5rem !important;
							padding-bottom: 1rem !important;
						}
					`}</style>
					{props.renderDefault(props)}
				</>
			)
		},
	},
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
			id: "_id",
			title: "title",
			target: "target",
		},
		prepare(selection) {
			const {
				id,
				title,
				target,
			} = selection
			return {
				title: title,
				media: id.replace(/^drafts\./, "") === "homepage" ? HomeIcon : (target === "external" ? LeaveIcon : null),
			}
		},
	},
})

function textBlock() {
	return defineArrayMember({
		name: "textBlock",
		type: "object",
		title: "Text",
		icon: EditIcon,
		fields: [
			defineField({
				name: "text",
				type: "portableText",
				title: "Text",
				description: "",
			}),
		],
		options: {
			exposedArrayConstraints: {
				includeInExposedArray: false,
			},
		},
		preview: {
			select: {
				text: "text",
			},
			prepare(selection) {
				const { text } = selection
				return {
					title: previewPortableText(text),
					subtitle: "Text",
				}
			},
		},
	})
}

function imageBlock() {
	// TODO
	return defineArrayMember({
		name: "imageBlock",
		type: "image",
		title: "Image",
		description: "",
		icon: ImageIcon,
		fields: [
			defineField({
				name: "displayMethod",
				type: "string",
				title: "Display Method",
				description: "",
				options: {
					list: [
						{
							value: "inline",
							title: "Inline",
						},
						{
							value: "block",
							title: "Block",
						},
					],
					layout: "radio",
				},
			}),
		],
		options: {
			exposedArrayConstraints: {
				includeInExposedArray: false,
			},
		},
		preview: {
			select: {
				originalFilename: "asset.originalFilename",
				asset: "asset",
			},
			prepare(selection) {
				const { originalFilename, asset } = selection
				return {
					title: originalFilename,
					subtitle: "Image",
					media: asset ? asset : ImageIcon
				}
			},
		}
	})
}

function pressBlock() {
	return defineArrayMember({
		name: "pressBlock",
		type: "object",
		title: "Press",
		icon: IceCreamIcon,
		fields: [
			defineField({
				name: "press",
				type: "array",
				title: "Press",
				description: "",
				of: [
					defineArrayMember({
						type: "reference",
						title: "Press",
						to: [{ type: "press" }],
						options: {
							disableNew: true,
							filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
						},
					}),
				],
				components: {
					input: ExposedArrayFunctions,
				},
			}),
		],
		options: {
			exposedArrayConstraints: {
				includeInExposedArray: false,
			},
		},
		preview: {
			select: {
				press0Title: "press.0.title",
				press1Title: "press.1.title",
				press2Title: "press.2.title",
				press3Title: "press.3.title",
				press0Ref: "press.0.url",
				press1Ref: "press.1.url",
				press2Ref: "press.2.url",
				press3Ref: "press.3.url",
			},
			prepare(selection) {
				const {
					press0Title,
					press1Title,
					press2Title,
					press3Title,
					press0Ref,
					press1Ref,
					press2Ref,
					press3Ref,
				} = selection
				const limit = (string) => {
					if (!string) { return null }
					if (!press1Ref) { return string }
					const maxLength = 22
					const trimmedString = string?.substring(0, maxLength)
					return string?.length <= maxLength
						? string
						: string.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "..."
				}
				return {
					title: previewArrayValues(
						limit(press0Title),
						limit(press1Title),
						limit(press2Title),
						limit(press3Title),
						{
							ref0: press0Ref,
							ref1: press1Ref,
							ref2: press2Ref,
							ref3: press3Ref,
							untitledLabel: "Untitled",
						},
					),
					subtitle: "Press",
				}
			},
		},
	})
}

function pageBlock() {
	return defineArrayMember({
		name: "pageBlock",
		type: "object",
		title: "Pages",
		icon: BillIcon,
		fields: [
			defineField({
				name: "pages",
				type: "array",
				title: "Pages",
				description: "",
				of: [
					defineArrayMember({
						type: "reference",
						title: "Page",
						to: [{ type: "page" }],
						options: {
							disableNew: true,
							filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
						},
					}),
				],
				components: {
					input: ExposedArrayFunctions,
				},
			}),
		],
		options: {
			exposedArrayConstraints: {
				includeInExposedArray: false,
			},
		},
		preview: {
			select: {
				page0Title: "pages.0.title",
				page1Title: "pages.1.title",
				page2Title: "pages.2.title",
				page3Title: "pages.3.title",
			},
			prepare(selection) {
				const {
					page0Title,
					page1Title,
					page2Title,
					page3Title,
				} = selection
				return {
					title: previewArrayValues(
						page0Title,
						page1Title,
						page2Title,
						page3Title,
					),
					subtitle: page1Title ? "Pages" : "Page",
				}
			},
		},
	})
}

function lookBlock() {
	return defineArrayMember({
		name: "lookBlock",
		type: "object",
		title: "Looks",
		icon: SparklesIcon,
		fields: [
			defineField({
				name: "project",
				type: "reference",
				title: "Project",
				description: "",
				to: [{ type: "project" }],
				options: {
					disableNew: true,
					filter: `isPublic == true && defined(address.current) && count(array::compact(looks[]->image.asset._ref)) >= 1`
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
							disableNew: true,
							filter: async ({document, parent, parentPath, getClient}) => {
								// TODO
								const currentKey = parentPath?.find((item) => item?._key)?._key
								const referencedProject = document?.content?.find((item) => item?._key === currentKey)?.project?._ref || ""
								const looksInReferencedProject = await getClient({apiVersion}).fetch(`*[_id == $referencedProject].looks[]->_id`, {
									referencedProject,
								})
								const referencedDocuments = parent?.map((document) => document?._ref)?.filter(Boolean) || ""
								return Promise.resolve({
									filter: `_id in $looksInReferencedProject && defined(image.asset._ref) && !(_id in $referencedDocuments)`,
									params: {
										looksInReferencedProject,
										referencedDocuments,
									}
								})
							},
						},
						validation: (Rule) => Rule.custom(async (value, context) => {
							// TODO
							if (value._ref) {
								const { document, path, getClient } = context
								const currentKey = path?.find((item) => item?._key)?._key
								const referencedLook = value._ref
								const referencedProject = document?.content?.find((item) => item?._key === currentKey)?.project?._ref || ""
								const looksInReferencedProject = await getClient({apiVersion}).fetch(`*[_id == $referencedProject].looks[]->_id`, {
									referencedProject,
								})
								if (!referencedProject) { return "This look's project must be specified." }
								if (!looksInReferencedProject.includes(referencedLook)) {
									return "This look does not correspond to the selected project."
								}
								return true
							}
							return true
						}),
					}),
				],
				components: {
					input: ExposedArrayFunctions,
				},
			}),
		],
		preview: {
			select: {
				projectTitle: "project.title",
				look0Title: "looks.0.title",
				look1Title: "looks.1.title",
				look2Title: "looks.2.title",
				look3Title: "looks.3.title",
				look0Ref: "looks.0._ref",
				look1Ref: "looks.1._ref",
				look2Ref: "looks.2._ref",
				look3Ref: "looks.3._ref",
			},
			prepare(selection) {
				const {
					projectTitle,
					look0Title,
					look1Title,
					look2Title,
					look3Title,
					look0Ref,
					look1Ref,
					look2Ref,
					look3Ref,
				} = selection
				return {
					title: previewArrayValues(
						look0Title,
						look1Title,
						look2Title,
						look3Title,
						{
							ref0: look0Ref,
							ref1: look1Ref,
							ref2: look2Ref,
							ref3: look3Ref,
							prefix: projectTitle,
							prepend: " (",
							append: ")",
							untitledLabel: "Untitled Look",
						}
					),
					subtitle: look1Ref ? "Looks" : "Look"
				}
			},
		},
	})
}

function projectBlock() {
	return defineArrayMember({
		name: "projectBlock",
		type: "object",
		title: "Projects",
		icon: DatabaseIcon,
		fields: [
			defineField({
				name: "projects",
				type: "array",
				title: "Projects",
				description: "",
				of: [
					defineArrayMember({
						type: "reference",
						title: "Project",
						to: [{ type: "project" }],
						options: {
							disableNew: true,
							filter: async ({document}) => {
								// TODO
								const referencedProjects = document?.content?.filter((block) => block?._type === "projectBlock")?.map((document) => document?.projects?.map((project) => project?._ref))?.filter(Boolean)?.flat() || ""
								return {
									filter: `!(_id in $referencedProjects) && isPublic == true && defined(address.current)`,
									params: {
										referencedProjects,
									}
								}
							},
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
				project0Title: "projects.0.title",
				project1Title: "projects.1.title",
				project2Title: "projects.2.title",
				project3Title: "projects.3.title",
			},
			prepare(selection) {
				const {
					project0Title,
					project1Title,
					project2Title,
					project3Title,
				} = selection
				return {
					title: previewArrayValues(
						project0Title,
						project1Title,
						project2Title,
						project3Title
					),
					subtitle: project1Title ? "Projects" : "Project"
				}
			},
		},
	})
}

function categoryBlock() {
	return defineArrayMember({
		name: "categoryBlock",
		type: "object",
		title: "Categories",
		icon: TagIcon,
		fields: [
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
							disableNew: true,
							filter: async ({document}) => {
								// TODO
								const referencedCategories = document?.content?.filter((block) => block?._type === "categoryBlock")?.map((document) => document?.categories?.map((category) => category?._ref))?.filter(Boolean)?.flat() || ""
								return {
									filter: `!(_id in $referencedCategories)`,
									params: {
										referencedCategories,
									}
								}
							},
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
				category0Title: "categories.0.title",
				category1Title: "categories.1.title",
				category2Title: "categories.2.title",
				category3Title: "categories.3.title",
			},
			prepare(selection) {
				const {
					category0Title,
					category1Title,
					category2Title,
					category3Title,
				} = selection
				return {
					title: previewArrayValues(
						category0Title,
						category1Title,
						category2Title,
						category3Title,
					),
					subtitle: category1Title ? "Categories" : "Category",
				}
			},
		},
	})
}