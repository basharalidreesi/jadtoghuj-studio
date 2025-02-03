import { defineField, defineType } from "sanity";
import { CustomMetadataDescriptions } from "../components";

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
				field: CustomMetadataDescriptions,
			},
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Description",
			rows: 3,
			components: {
				field: CustomMetadataDescriptions,
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
				field: CustomMetadataDescriptions,
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
				field: CustomMetadataDescriptions,
			},
		}),
	],
	options: {
		collapsible: true,
		collapsed: true,
	},
});