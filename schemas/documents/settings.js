import { CheckmarkCircleIcon, CogIcon, DocumentsIcon } from "@sanity/icons"
import { previewArrayValues } from "../../lib/previewArrayValues"

export default {
	name: "settings",
	type: "document",
	title: "Settings",
	icon: CogIcon,
	groups: [
		{
			name: "information",
			title: "Information",
		},
		{
			name: "presentation",
			title: "Presentation",
		},
		{
			name: "configuration",
			title: "Configuration",
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
			name: "website",
			type: "website",
			title: "Website",
			description: "The website to which this settings page is attributed.",
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
			name: "keywords",
			type: "array",
			title: "Keywords",
			description: "A list of tags that best describe this website and its content.",
			of: [{ type: "string" }],
			options: {
				layout: "tags", 
			},
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
									title: "Page",
									to: [{ type: "page" }],
									options: {
										disableNew: true,
										filter: ({document}) => {
											const listedPages = document?.navigation?.map(group => group?.pages?.map(page => page?._ref))?.filter(Boolean)?.flat()
											return {
												filter: '(website == $website && !(_id in $listedPages))',
												params: {
													website: document.website,
													listedPages: listedPages,
												},
											}
										},
									},
								},
								{
									name: "currentPage",
									type: "object",
									title: "Current Page",
									fields: [
										{
											name: "title",
											type: "string",
											initialValue: "Current Page",
										}
									],
									preview: {
										prepare() {
											return {
												title: "Current Page",
												subtitle: "Placeholder",
												media: CheckmarkCircleIcon,
											}
										},
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
								media: DocumentsIcon,
							}
						},
					},
				},
			],
			group: "presentation",
		},
		{
			name: "url",
			type: "url",
			title: "URL",
			description: "The scheme, subdomain, second-level domain, and top-level domain of this website.",
			group: "configuration",
		},
		{
			name: "baseUrl",
			type: "string",
			title: "Base URL",
			description: "The subdirectory under which this website exists. The base URL Must begin with a forward slash, and mustn't end with a trailing one.",
			group: "configuration",
		},
		{
			name: "projectPath",
			type: "string",
			title: "Project path",
			description: "",
			group: "configuration",
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
		select: {
			website: "website",
		},
		prepare(selection) {
			const { website } = selection
			return {
				title: "Settings",
				subtitle: website,
				media: CogIcon,
			}
		},
	},
}