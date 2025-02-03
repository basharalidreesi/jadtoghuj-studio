import { defineType } from "sanity";

export default defineType({
	name: "isHiddenFromListings",
	type: "boolean",
	description: "Check this box to hide the item from listings. If published, it may still be accessed via direct URL, but it will not be displayed in any of the website's main listings.",
	options: {
		layout: "checkbox",
	},
	initialValue: false,
});