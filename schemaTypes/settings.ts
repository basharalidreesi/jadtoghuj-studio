import { defineArrayMember, defineField, defineType } from "sanity";
import { imageConfig, stringConfig } from "../util";
import { CogIcon } from "@sanity/icons";

export const SETTINGS_TITLE = "Settings";
export const SETTINGS_ICON = CogIcon;

export default defineType({
	name: "settings",
	type: "document",
	title: SETTINGS_TITLE,
	icon: SETTINGS_ICON,
	__experimental_formPreviewTitle: false,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Website Title",
			description: "This title of this Website. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
		}),
		defineField({
			name: "description",
			type: "text",
			title: "Website Description",
			description: "A brief description or summary of this Website. Will appear in social media shares and in Google Search results. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
			rows: 5,
		}),
		defineField({
			name: "author",
			type: "string",
			title: "Author",
			description: "The person associated with this Website. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
		}),
		defineField({
			name: "instagram",
			type: "url",
			title: "Instagram Link",
			description: "The URL linking to the Instagram associated with this Website. This field is required.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "keywords",
			type: "array",
			title: "Website Keywords",
			description: "Keywords that best describe this Website and its content for SEO purposes. This field is required.",
			of: [{ type: "string", }],
			options: { layout: "tags", },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "analytics",
			type: "string",
			title: "Analytics Snippet",
			description: "The code snippet provided by your analytics provider. This field is optional.",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare(selection) {
			const {
				title,
			} = selection;
			return {
				title: title,
				media: null,
			};
		},
	},
});