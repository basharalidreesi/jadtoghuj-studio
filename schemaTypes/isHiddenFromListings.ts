import { defineType } from "sanity";

export default defineType({
	name: "isHiddenFromListings",
	type: "boolean",
	description: "Check this box to hide the item from the website's main listings. If published, it may still be accessed via direct URL.",
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});