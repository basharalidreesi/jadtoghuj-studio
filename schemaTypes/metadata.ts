import { defineField, defineType } from "sanity";
import { MetadataDescriptions } from "../components";

export default defineType({
	name: "metadata",
	type: "object",
	description: "SEO and social media preview details.",
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			components: {
				field: MetadataDescriptions,
			},
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			rows: 3,
			components: {
				field: MetadataDescriptions,
			},
		}),
		defineField({
			name: "openGraphImage",
			type: "image",
			title: "OpenGraph Image",
			options: {
				storeOriginalFilename: false,
			},
			components: {
				field: MetadataDescriptions,
			},
		}),
		defineField({
			name: "twitterImage",
			type: "image",
			title: "Twitter Image",
			options: {
				storeOriginalFilename: false,
			},
			components: {
				field: MetadataDescriptions,
			},
		}),
	],
	options: {
		collapsible: true,
		collapsed: true,
	},
});