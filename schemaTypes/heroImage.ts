import { defineType } from "sanity";

export default defineType({
	name: "heroImage",
	type: "image",
	description: "An image that represents this item.",
	options: {
		hotspot: true,
		storeOriginalFilename: false,
	},
});