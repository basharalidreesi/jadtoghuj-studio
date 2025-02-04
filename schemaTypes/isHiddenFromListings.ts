import { defineType } from "sanity";

export default defineType({
	name: "isHiddenFromListings",
	type: "boolean",
	description: "Check this box to exclude this item from the website's main listings. If published, it may still be accessible via direct URL.",
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});