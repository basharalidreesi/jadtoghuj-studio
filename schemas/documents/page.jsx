import { apiVersion } from "../../sanity.client"
import { PrefixedInput } from "../../components"
import { checkIfValueAlreadyExistsInType, filterAlreadyReferencedDocuments, previewArrayValues, previewPortableText } from "../../lib"
import { DatabaseIcon, EarthGlobeIcon, EditIcon, HomeIcon, ImageIcon, SparkleIcon, SparklesIcon, TagIcon } from "@sanity/icons"

// TODO

export default {
	name: "page",
	type: "document",
	title: "Page",
	icon: EarthGlobeIcon,
	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueAlreadyExistsInType).warning(),
		},
		{
			name: "address",
			type: "slug",
			title: "Address",
			description: "",
			components: {
				input: (props) => <PrefixedInput source={"settings"} prefix={["url", "basePath"]} suffix={"/"} {...props} />,
			},
			options: {
				source: "title",
				isUnique: async (value, context) => {
					const { document, getClient } = context
					const client = getClient({apiVersion})
					const id = document._id.replace(/^drafts\./, "")
					const query = `!defined(*[!(_id in [$draft, $published]) && address.current == $value && _type == $type][0]._id)`
					const params = {
						draft: `drafts.${id}`,
						published: id,
						type: document._type,
						value,
					}
					return await client.fetch(query, params)
				},
			},
		},
		{
			name: "contents",
			type: "array",
			title: "Contents",
			description: "",
			of: [
				// textBlock(),
				// imageBlock(),
				lookBlock(),
				projectBlock(),
				categoryBlock(),
				// pageBlock(),
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
				media: address === "/" ? HomeIcon : null,
			}
		},
	},
}

function textBlock() {
	return {
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
					subtitle: "Text"
				}
			},
		},
	}
}

function imageBlock() {
	return {
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
					subtitle: "Image",
					media: asset ? asset : ImageIcon
				}
			},
		}
	}
}

function lookBlock() {
	return {
		name: "lookBlock",
		type: "object",
		title: "Looks",
		icon: SparklesIcon,
		fields: [
			{
				name: "project",
				type: "reference",
				title: "Project",
				description: "",
				to: [{ type: "project" }],
				options: {
					disableNew: true,
					filter: 'isPublic == true && defined(address.current) && count(array::compact(looks[]->image.asset._ref)) >= 1'
				},
			},
			{
				name: "looks",
				type: "array",
				title: "Looks",
				description: "",
				of: [
					{
						type: "reference",
						title: "Looks",
						to: [{ type: "look" }],
						options: {
							disableNew: true,
							filter: async ({document, parent, parentPath, getClient}) => {
								const currentKey = parentPath?.find(item => item?._key)?._key
								const referencedProject = document?.contents?.find(item => item?._key === currentKey)?.project?._ref || ""
								const looksInReferencedProject = await getClient({apiVersion}).fetch(`*[_id == $referencedProject].looks[]->_id`, {
									referencedProject,
								})
								const referencedDocuments = parent?.map(doc => doc?._ref)?.filter(Boolean) || ""
								return Promise.resolve({
									filter: '_id in $looksInReferencedProject && defined(image.asset._ref) && !(_id in $referencedDocuments)',
									params: {
										looksInReferencedProject,
										referencedDocuments,
									}
								})
							},
						},
						validation: (Rule) => Rule.custom(async (value, context) => {
							if (value._ref) {
								const { document, path, getClient } = context
								const currentKey = path?.find(item => item?._key)?._key
								const referencedLook = value._ref
								const referencedProject = document?.contents?.find(item => item?._key === currentKey)?.project?._ref || ""
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
					},
				],
			},
		],
		preview: {
			select: {
				title: "project.title",
				look0: "looks.0.title",
				look1: "looks.1.title",
				look2: "looks.2.title",
				look3: "looks.3.title",
				ref0: "looks.0._ref",
				ref1: "looks.1._ref",
				ref2: "looks.2._ref",
				ref3: "looks.3._ref",
			},
			prepare(selection) {
				const { title, look0, look1, look2, look3, ref0, ref1, ref2, ref3 } = selection
				return {
					title: previewArrayValues(look0, look1, look2, look3, {
						ref0: ref0,
						ref1: ref1,
						ref2: ref2,
						ref3: ref3,
						prefix: title,
						prepend: " (",
						append: ")",
						untitledLabel: "Untitled Look",
					}),
					subtitle: ref1 ? "Looks" : "Look",
					media: ref1 ? SparklesIcon : SparkleIcon,
				}
			},
		},
	}
}

function projectBlock() {
	return {
		name: "projectBlock",
		type: "object",
		title: "Projects",
		icon: DatabaseIcon,
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
							filter: async ({document}) => {
								const referencedProjects = document?.contents?.filter(block => block?._type === "projectBlock")?.map(doc => doc?.projects?.map(project => project?._ref))?.filter(Boolean)?.flat() || ""
								return {
									filter: '!(_id in $referencedProjects) && isPublic == true && defined(address.current)',
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
					subtitle: project1 ? "Projects" : "Project",
				}
			},
		},
	}
}

function categoryBlock() {
	return {
		name: "categoryBlock",
		type: "object",
		title: "Categories",
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
							filter: async ({document}) => {
								const referencedCategories = document?.contents?.filter(block => block?._type === "categoryBlock")?.map(doc => doc?.categories?.map(category => category?._ref))?.filter(Boolean)?.flat() || ""
								return {
									filter: '!(_id in $referencedCategories)',
									params: {
										referencedCategories,
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
				category0: "categories.0.title",
				category1: "categories.1.title",
				category2: "categories.2.title",
				category3: "categories.3.title",
			},
			prepare(selection) {
				const { category0, category1, category2, category3 } = selection
				return {
					title: previewArrayValues(category0, category1, category2, category3),
					subtitle: category1 ? "Categories" : "Category",
				}
			},
		},
	}
}

function pageBlock() {
	return {
		name: "pageBlock",
		type: "object",
		title: "Pages",
		icon: EarthGlobeIcon,
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
}