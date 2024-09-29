import { defineField, defineType } from "sanity";

export default defineType({
	name: "metadata",
	type: "object",
	title: "Metadata",
	// description
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			// description
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			// description
			rows: 3,
		}),
		defineField({
			name: "openGraphImage",
			type: "image",
			title: "Open Graph Image",
			description: "Recommended size: 1200 × 630 pixels",
			options: {
				storeOriginalFilename: false,
			},
		}),
		defineField({
			name: "twitterImage",
			type: "image",
			title: "Twitter Image",
			description: "Recommended size: 1200 × 600 pixels",
			options: {
				storeOriginalFilename: false,
			},
		}),
	],
	options: {
		collapsible: true,
		collapsed: true,
	},
});