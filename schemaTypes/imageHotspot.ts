import { defineField, defineType } from "sanity";
import { ImageHotspotItem } from "../components";

export default defineType({
	name: "imageHotspot",
	type: "object",
	title: "Image Hotspot",
	fieldsets: [
		{
			name: "position",
			title: "Position",
			readOnly: true,
			hidden: true,
			options: {
				columns: 2,
			},
		},
	],
	fields: [
		defineField({
			name: "x",
			type: "number",
			title: "X Position",
			// description
			initialValue: 50,
			validation: (Rule) => Rule.required().min(0).max(100),
			fieldset: "position",
		}),
		defineField({
			name: "y",
			type: "number",
			title: "Y Position",
			// description
			initialValue: 50,
			validation: (Rule) => Rule.required().min(0).max(100),
			fieldset: "position",
		}),
		defineField({
			name: "details",
			type: "simplePortableText",
			title: "Details",
			// description
		}),
	],
	components: {
		item: ImageHotspotItem,
	},
});