import { defineType } from "sanity";

export default defineType({
	name: "heroImage",
	type: "image",
	title: "Hero Image",
	// description
	options: {
		hotspot: true,
		storeOriginalFilename: false,
	},
});