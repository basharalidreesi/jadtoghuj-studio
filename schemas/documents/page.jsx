import { defineField, defineType } from "sanity"
import { apiVersion } from "../../sanity.client"
import { ExposedArrayFunctions, InputWithPrefixOrSuffix } from "../../components"
import { checkIfValueAlreadyExistsInType, filterAlreadyReferencedDocuments, previewArrayValues, previewPortableText } from "../../lib"
import { BillIcon, DatabaseIcon, EditIcon, HomeIcon, ImageIcon, SparklesIcon, TagIcon } from "@sanity/icons"

export default defineType({
	name: "page",
	type: "document",
	title: "Page",
	icon: BillIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueAlreadyExistsInType).warning(),
		}),
		defineField({
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			options: {
				source: "title",
			},
			components: {
				input: (props) => <InputWithPrefixOrSuffix options={{ prefix: { fromDocument: "settings", fromFields: ["url", "basePath"] }, suffix: {fromString: "/"} }} {...props} />,
			},
			readOnly: ({document}) => ["homepage", "drafts.homepage"].includes(document._id) ? true : false,
		}),
		defineField({
			name: "contents",
			type: "array",
			title: "Contents",
			description: "",
			of: [
				textBlock(),
				imageBlock(),
				lookBlock(),
				projectBlock(),
				categoryBlock(),
				pageBlock(),
			],
			options: {
				exposedArrayOptions: {
					withDefault: true,
				},
			},
			components: {
				input: ExposedArrayFunctions,
			},
		}),
		defineField({
			name: "hasCustomColours",
			type: "boolean",
			title: "Custom Colours",
			description: "",
			initialValue: false,
		}),
		defineField({
			name: "colours",
			type: "gradient",
			title: "Colours",
			description: "",
			hidden: ({parent}) => !parent?.hasCustomColours,
		}),
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
			id: "_id",
			title: "title",
		},
		prepare(selection) {
			const { id, title } = selection
			return {
				title: title,
				media: id.replace(/^drafts\./, "") === "homepage" ? HomeIcon : null,
			}
		},
	},
})

function textBlock() {
	return defineField({
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
	return defineField({
		name: "imageBlock",
		type: "image",
		title: "Image",
		description: "",
		icon: ImageIcon,
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

function lookBlock() {
	return defineField({
		name: "lookBlock",
		type: "object",
		title: "Look(s)",
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
					defineField({
						type: "reference",
						title: "Look",
						to: [{ type: "look" }],
						options: {
							disableNew: true,
							filter: async ({document, parent, parentPath, getClient}) => {
								// TODO
								const currentKey = parentPath?.find((item) => item?._key)?._key
								const referencedProject = document?.contents?.find((item) => item?._key === currentKey)?.project?._ref || ""
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
								const referencedProject = document?.contents?.find((item) => item?._key === currentKey)?.project?._ref || ""
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
	return defineField({
		name: "projectBlock",
		type: "object",
		title: "Project(s)",
		icon: DatabaseIcon,
		fields: [
			defineField({
				name: "projects",
				type: "array",
				title: "Projects",
				description: "",
				of: [
					defineField({
						type: "reference",
						title: "Project",
						to: [{ type: "project" }],
						options: {
							disableNew: true,
							filter: async ({document}) => {
								// TODO
								const referencedProjects = document?.contents?.filter((block) => block?._type === "projectBlock")?.map((document) => document?.projects?.map((project) => project?._ref))?.filter(Boolean)?.flat() || ""
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
	return defineField({
		name: "categoryBlock",
		type: "object",
		title: "Categor(y/ies)",
		icon: TagIcon,
		fields: [
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
							disableNew: true,
							filter: async ({document}) => {
								// TODO
								const referencedCategories = document?.contents?.filter((block) => block?._type === "categoryBlock")?.map((document) => document?.categories?.map((category) => category?._ref))?.filter(Boolean)?.flat() || ""
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

function pageBlock() {
	return defineField({
		name: "pageBlock",
		type: "object",
		title: "Page(s)",
		icon: BillIcon,
		fields: [
			defineField({
				name: "pages",
				type: "array",
				title: "Pages",
				description: "",
				of: [
					defineField({
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