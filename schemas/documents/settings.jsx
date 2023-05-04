import { defineField, defineType } from "sanity"
import { ExposedArrayFunctions, PrefixedInput } from "../../components"
import { filterAlreadyReferencedDocuments, previewArrayValues } from "../../lib"
import { BillIcon, BulbOutlineIcon, CogIcon, InfoOutlineIcon, TokenIcon, TruncateIcon } from "@sanity/icons"

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
					title: "Navigation Group",
					icon: TokenIcon,
					fields: [
						defineField({
							name: "pages",
							type: "array",
							title: "Pages",
							of: [
								defineField({
									name: "page",
									type: "reference",
									title: "Page",
									icon: BillIcon,
									to: [{ type: "page" }],
									options: {
										disableNew: true,
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								}),
								defineField({
									name: "separator",
									type: "object",
									title: "Separator",
									icon: TruncateIcon,
									fields: [
										defineField({
											name: "label",
											type: "string",
											title: "Label",
											description: "",
										}),
									],
									options: {
										exposedArrayConstraints: {
											maxAllowed: 1,
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
							page0Title: "pages.0.title",
							page1Title: "pages.1.title",
							page2Title: "pages.2.title",
							page3Title: "pages.3.title",
							separator0Label: "pages.0.label",
							separator1Label: "pages.1.label",
							separator2Label: "pages.2.label",
							separator3Label: "pages.3.label",
						},
						prepare(selection) {
							const {
								page0Title,
								page1Title,
								page2Title,
								page3Title,
								separator0Label,
								separator1Label,
								separator2Label,
								separator3Label
							} = selection
							const transformSeparator = (separator) => {
								return separator ? `[${separator.toUpperCase()}]→` : null
							}
							return {
								title: previewArrayValues(
									page0Title || transformSeparator(separator0Label),
									page1Title || transformSeparator(separator1Label),
									page2Title || transformSeparator(separator2Label),
									page3Title || transformSeparator(separator3Label),
								),
							}
						},
					},
				}),
			],
			group: "presentation",
			components: {
				input: ExposedArrayFunctions,
			},
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