import { defineType } from "sanity";

export default defineType({
	name: "heroImage",
	type: "image",
	options: {
		hotspot: true,
		storeOriginalFilename: false,
	},
});