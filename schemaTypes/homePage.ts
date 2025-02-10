import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePageIcon = HomeIcon;

export default defineType({
	name: "homePage",
	type: "document",
	title: "Homepage",
	icon: homePageIcon,
	__experimental_omnisearch_visibility: false,
	fields: [ // TODO define homepage fields
		defineField({
			name: "temp",
			type: "string",
		}),
		// TODO splash
	],
	preview: {
		prepare() {
			return {
				title: "Homepage",
			};
		},
	},
});