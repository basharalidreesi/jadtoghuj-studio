import { defineType } from "sanity";

export default defineType({
	name: "isHiddenFromHomePage",
	type: "boolean",
	title: "Hide from home page?",
	// description
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});