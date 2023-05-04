import { PrefixedInput } from "../../components"
import { filterAlreadyReferencedDocuments, previewArrayValues } from "../../lib"
import { BulbOutlineIcon, CogIcon, DocumentsIcon, DocumentTextIcon, InfoOutlineIcon, LeaveIcon } from "@sanity/icons"

export default {
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
		{
			name: "title",
			type: "string",
			title: "Title",
			description: "The title of this website.",
			group: "information",
		},
		{
			name: "description",
			type: "text",
			title: "Description",
			description: "A brief description of this website.",
			group: "information",
		},
		{
			name: "logo",
			type: "image",
			title: "Logo",
			description: "The logo to be used in this website. SVG format is required.",
			options: {
				storeOriginalFilename: false,
				accept: ".svg",
			},
			group: "presentation",
		},
		{
			name: "colours",
			type: "gradient",
			title: "Colours",
			description: "",
			group: "presentation",
		},
		{
			name: "navigation",
			type: "array",
			title: "Navigation",
			description: "",
			of: [
				{
					name: "group",
					type: "object",
					title: "Group",
					fields: [
						{
							name: "pages",
							type: "array",
							title: "Pages",
							of: [
								{
									name: "page",
									type: "reference",
									title: "Internal Page",
									icon: DocumentTextIcon,
									to: [{ type: "page" }],
									options: {
										disableNew: true,
										filter: ({parent}) => filterAlreadyReferencedDocuments(parent),
									},
								},
								{
									name: "external",
									type: "object",
									title: "External Page",
									icon: LeaveIcon,
									fields: [
										{
											name: "title",
											type: "string",
											title: "Title",
											description: "",
										},
										{
											name: "address",
											type: "url",
											title: "Address",
											description: "",
										},
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
												media: LeaveIcon,
											}
										},
									},
								},
							],
						},
						{
							name: "truncation",
							type: "object",
							title: "Truncation",
							description: "",
							fields: [
								{
									name: "isTruncated",
									type: "boolean",
									title: "Truncate",
									description: "",
									initialValue: false,
								},
								{
									name: "limit",
									type: "number",
									title: "Limit",
									description: "",
									hidden: ({parent}) => !parent?.isTruncated,
								},
								{
									name: "label",
									type: "string",
									title: "Label",
									description: "",
									hidden: ({parent}) => !parent?.isTruncated,
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
								media: DocumentsIcon,
							}
						},
					},
				},
			],
			group: "presentation",
		},
		{
			name: "footer",
			type: "portableText",
			title: "Footer",
			description: "",
			group: "presentation",
		},
		{
			name: "url",
			type: "url",
			title: "URL",
			description: "The scheme, subdomain, second-level domain, and top-level domain of this website. A trailing slash is required.",
			group: "configuration",
		},
		{
			name: "basePath",
			type: "string",
			title: "Base Path",
			description: "The subdirectory under which all content is filed. A trailing slash is required if a value is specified.",
			group: "configuration",
			components: {
				input: (props) => <PrefixedInput prefix={["url"]} {...props} />,
			},
		},
		{
			name: "projectPath",
			type: "string",
			title: "Project Path",
			description: "The subdirectory under which projects are filed. A trailing slash is required if a value is specified.",
			group: "configuration",
			components: {
				input: (props) => <PrefixedInput prefix={["url", "basePath"]} {...props} />,
			},
		},
		{
			name: "analytics",
			type: "string",
			title: "Analytics",
			description: "The code snippet supplied by your analytics provider. ",
			group: "configuration",
		},
	],
	preview: {
		prepare() {
			return {
				title: "Settings",
				media: CogIcon,
			}
		},
	},
}