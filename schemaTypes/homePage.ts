import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePageIcon = HomeIcon;

export default defineType({
	name: "homePage",
	type: "document",
	title: "Home Page",
	icon: homePageIcon,
	fields: [
		defineField({
			name: "temp",
			type: "string",
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Home Page",
			};
		},
	},
});