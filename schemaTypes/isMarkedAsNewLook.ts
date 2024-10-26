import { defineType } from "sanity";

export default defineType({
	name: "isMarkedAsNewLook",
	type: "boolean",
	title: "Mark as new look?",
	// description
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});