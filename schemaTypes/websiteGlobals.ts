import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const websiteGlobalsIcon = CogIcon;

export default defineType({
	name: "websiteGlobals",
	type: "document",
	title: "Website Globals",
	icon: websiteGlobalsIcon,
	__experimental_omnisearch_visibility: false,
	fields: [
		defineField({
			name: "analyticsSnippet",
			type: "string",
			title: "Analytics Snippet",
			// description
		}),
		// TODO
	],
	preview: {
		prepare() {
			return {
				title: "Website Globals",
			};
		},
	},
});