import { defineType } from "sanity";

export default defineType({
	name: "tags",
	type: "array",
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