import { defineArrayMember, defineField, defineType } from "sanity";
import { OkHandIcon } from "@sanity/icons";

export const recommendedItemsIcons = OkHandIcon;

export default defineType({
	name: "recommendedItems",
	type: "document",
	title: "Recommended Items",
	icon: recommendedItemsIcons,
	fields: [
		defineField({
			name: "recommendedItems",
			type: "array",
			title: "Recommended Items",
			// description
			of: [
				defineArrayMember({
					type: "reference",
					to: [
						{
							type: "article",
						},
						{
							type: "pressItem",
						},
						{
							type: "project",
						},
					],
					options: {
						disableNew: true,
					},
				}),
			],
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Recommended Items",
			};
		},
	},
});