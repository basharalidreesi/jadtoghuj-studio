import { defineType } from "sanity";

export default defineType({
	name: "doesHaveBorder",
	type: "boolean",
	// TODO description
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});