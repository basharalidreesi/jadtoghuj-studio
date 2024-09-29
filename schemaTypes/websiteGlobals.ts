import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const websiteGlobalsIcon = CogIcon;

export default defineType({
	name: "websiteGlobals",
	type: "document",
	title: "Website Globals",
	icon: websiteGlobalsIcon,
	fields: [
		defineField({
			name: "temp",
			type: "string",
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Website Globals",
			};
		},
	},
});