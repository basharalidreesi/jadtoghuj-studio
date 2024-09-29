import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { isoDateToReadableDate } from "../utils/dateUtils";
import { portableTextToPlainText } from "../utils/portableTextUtils";

export default defineType({
	name: "project",
	type: "document",
	title: "Project",
	icon: SparklesIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			// description
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			// description
			options: {
				source: "title",
			},
		}),
		defineField({
			name: "isHiddenFromHomePage",
			type: "isHiddenFromHomePage",
			title: "Hide from home page?",
		}),
		defineField({
			name: "startDate",
			type: "date",
			title: "Start Date",
			// description
		}),
		defineField({
			name: "endDate",
			type: "date",
			title: "End Date",
			// description
		}),
		defineField({
			name: "heroImage",
			type: "heroImage",
			title: "Hero Image",
		}),
		defineField({
			name: "heroImageCaption",
			type: "simplePortableText",
			title: "Hero Image Caption",
			// description
		}),
		defineField({
			name: "introduction",
			type: "simplePortableText",
			title: "Introduction",
			// description
		}),
		defineField({
			name: "metadata",
			type: "metadata",
			title: "Metadata",
		}),
		defineField({
			name: "tags",
			type: "tags",
			title: "Tags",
		}),
		defineField({
			name: "category",
			type: "reference",
			title: "Category",
			// description
			to: [
				{
					type: "category",
				},
			],
		}),
		defineField({
			name: "mediaContent",
			type: "mediaContent",
			title: "Media",
		}),
		defineField({
			name: "bodyContent",
			type: "bodyContent",
			title: "Body",
		}),
	],
	orderings: [
		{
			title: "Date",
			name: "dateDesc",
			by: [
				{
					field: "startDate",
					direction: "desc",
				},
				{
					field: "endDate",
					direction: "desc",
				},
				{
					field: "title",
					direction: "asc",
				},
			],
		},
		{
			title: "Title",
			name: "titleAsc",
			by: [
				{
					field: "title",
					direction: "asc",
				},
			],
		},
	],
	preview: {
		select: {
			title: "title",
			startDate: "startDate",
			endDate: "endDate",
			categoryName: "category.name",
			heroImage: "heroImage",
			introduction: "introduction",
		},
		prepare(selection) {
			const {
				title,
				startDate,
				endDate,
				categoryName,
				heroImage,
				introduction,
			} = selection;
			return {
				title: title,
				subtitle: [categoryName, [isoDateToReadableDate(startDate, true), isoDateToReadableDate(endDate, true)]?.filter(Boolean)?.join(" – ") || null]?.filter(Boolean)?.join(" • "),
				media: heroImage,
				description: portableTextToPlainText(introduction),
			};
		},
	},
});