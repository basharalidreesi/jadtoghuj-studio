import { defineField, defineType } from "sanity"
import { PrefixedInput } from "../../components"
import { filterAlreadyReferencedDocuments, previewArrayValues } from "../../lib"
import { BulbOutlineIcon, CogIcon, DocumentsIcon, DocumentTextIcon, InfoOutlineIcon, LeaveIcon } from "@sanity/icons"

// TODO

export default defineType({
	name: "settings",
	type: "document",
	title: "Settings",
	icon: CogIcon,
	groups: [
		{
			name: "information",
			title: "Information",
			icon: InfoOutlineIcon,
		},
		{
			name: "presentation",
			title: "Presentation",
			icon: BulbOutlineIcon,
		},
		{
			name: "configuration",
			title: "Configuration",
			icon: CogIcon,
		},
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "The title of this website.",
			group: "information",
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			description: "A brief description of this website.",
			group: "information",
		}),
		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
			description: "The logo to be used in this website. SVG format is required.",
			options: {
				storeOriginalFilename: false,
				accept: ".svg",
			},
			group: "presentation",
		}),
		defineField({
			name: "colours",
			type: "gradient",
			title: "Colours",
			description: "",
			group: "presentation",
		}),
		defineField({
			name: "navigation",
			type: "array",
			title: "Navigation",
			description: "",
			of: [
				defineField({
					name: "group",
					type: "object",
					title: "Group",
					icon: DocumentsIcon,
					fields: [
						defineField({
							name: "pages",
							type: "array",
							title: "Pages",
							of: [
								defineField({
									name: "page",
									type: "reference",
									title: "Internal Page",
									icon: DocumentTextIcon,
									to: [{ type: "page" }],
									options: {
										disableNew: true,
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								}),
								defineField({
									name: "external",
									type: "object",
									title: "External Page",
									icon: LeaveIcon,
									fields: [
										defineField({
											name: "title",
											type: "string",
											title: "Title",
											description: "",
										}),
										defineField({
											name: "address",
											type: "url",
											title: "Address",
											description: "",
										}),
									],
									preview: {
										select: {
											title: "title",
											address: "address",
										},
										prepare(selection) {
											const { title, address } = selection
											return {
												title: title,
												subtitle: address,
											}
										},
									},
								}),
							],
						}),
						defineField({
							name: "truncation",
							type: "object",
							title: "Truncation",
							description: "",
							fields: [
								defineField({
									name: "isTruncated",
									type: "boolean",
									title: "Truncate",
									description: "",
									initialValue: false,
								}),
								defineField({
									name: "limit",
									type: "number",
									title: "Limit",
									description: "",
									hidden: ({parent}) => !parent?.isTruncated,
								}),
								defineField({
									name: "label",
									type: "string",
									title: "Label",
									description: "",
									hidden: ({parent}) => !parent?.isTruncated,
								}),
							],
						}),
					],
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
								page3Title
							} = selection
							return {
								title: previewArrayValues(
									page0Title,
									page1Title,
									page2Title,
									page3Title
								),
							}
						},
					},
				}),
			],
			group: "presentation",
		}),
		defineField({
			name: "footer",
			type: "portableText",
			title: "Footer",
			description: "",
			group: "presentation",
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "The scheme, subdomain, second-level domain, and top-level domain of this website. A trailing slash is required.",
			group: "configuration",
		}),
		defineField({
			name: "basePath",
			type: "string",
			title: "Base Path",
			description: "The subdirectory under which all content is filed. A trailing slash is required if a value is specified.",
			group: "configuration",
			components: {
				input: (props) => <PrefixedInput prefix={["url"]} {...props} />,
			},
		}),
		defineField({
			name: "projectPath",
			type: "string",
			title: "Project Path",
			description: "The subdirectory under which projects are filed. A trailing slash is required if a value is specified.",
			group: "configuration",
			components: {
				input: (props) => <PrefixedInput prefix={["url", "basePath"]} {...props} />,
			},
		}),
		defineField({
			name: "analytics",
			type: "string",
			title: "Analytics",
			description: "The code snippet supplied by your analytics provider. ",
			group: "configuration",
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Settings",
			}
		},
	},
})