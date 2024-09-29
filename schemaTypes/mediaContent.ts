import { defineType } from "sanity";

export default defineType({
	name: "mediaContent",
	type: "array",
	title: "Media Content",
	// description
	of: [
		{
			type: "string",
		}
	],
});