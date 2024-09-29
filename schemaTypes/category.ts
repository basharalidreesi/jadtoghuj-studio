import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
	name: "category",
	type: "document",
	title: "Category",
	icon: TagIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Name",
			// description
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			// description
			options: {
				source: "name",
			},
		}),
		defineField({
			name: "isHiddenFromHomePage",
			type: "isHiddenFromHomePage",
			title: "Hide from home page?",
		}),
		defineField({
			name: "metadata",
			type: "metadata",
			title: "Metadata",
		}),
	],
	orderings: [
		{
			title: "Name",
			name: "nameAsc",
			by: [
				{
					field: "name",
					direction: "asc",
				},
			],
		},
	],
});