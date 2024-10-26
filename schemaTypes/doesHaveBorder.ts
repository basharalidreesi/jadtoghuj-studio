import { defineType } from "sanity";

export default defineType({
	name: "doesHaveBorder",
	type: "boolean",
	title: "Add border around image?",
	// description
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});