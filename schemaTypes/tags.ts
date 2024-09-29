import { defineType } from "sanity";

export default defineType({
	name: "tags",
	type: "array",
	title: "Tags",
	// description
	of: [
		{
			type: "string",
		}
	],
	options: {
		layout: "tags",
	},
});