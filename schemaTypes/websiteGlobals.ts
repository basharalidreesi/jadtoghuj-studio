import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const websiteGlobalsIcon = CogIcon;

export default defineType({
	name: "websiteGlobals",
	type: "document",
	title: "Website Settings",
	icon: websiteGlobalsIcon,
	__experimental_omnisearch_visibility: false,
	fields: [
		defineField({
			name: "analyticsSnippet",
			type: "string",
			title: "Analytics Snippet",
			// TODO description
		}),
		// TODO announcement
		// TODO nav
		// TODO colours? as a reusable object?
		// TODO
	],
	preview: {
		prepare() {
			return {
				title: "Website Settings",
			};
		},
	},
});