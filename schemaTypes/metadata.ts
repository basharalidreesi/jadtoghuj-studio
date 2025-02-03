import { defineField, defineType } from "sanity";

export default defineType({
	name: "metadata",
	type: "object",
	description: "SEO and social media preview details.",
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "The title that appears in search engine results and social media previews. Leave blank to use the item's default title.",
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			description: "The summary that appears in search engine results and social media previews. If left blank, the studio's short description will be used.",
			rows: 3,
		}),
		defineField({
			name: "openGraphImage",
			type: "image",
			title: "OpenGraph Image",
			description: "The image that appears when this item is shared on Facebook, WhatsApp, and a number of other platforms. If left blank, the studio's logo will be used. Recommended size: 1200 × 630 pixels.",
			options: {
				storeOriginalFilename: false,
			},
		}),
		defineField({
			name: "twitterImage",
			type: "image",
			title: "Twitter Image",
			description: "The image that appears when this item is shared on Twitter. If left blank, the studio's logo will be used. Recommended size: 1200 × 600 pixels.",
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