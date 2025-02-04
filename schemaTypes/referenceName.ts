import { defineType } from "sanity";

export default defineType({
	name: "referenceName",
	type: "string",
	description: "An internal name for this media item. Will not be displayed anywhere on the website.",
});