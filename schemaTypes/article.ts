import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";
import { isoDateToReadableDate } from "../utils/dateUtils";
import { portableTextToPlainText } from "../utils/portableTextUtils";

export default defineType({
	name: "article",
	type: "document",
	title: "Article",
	icon: BulbOutlineIcon,
	fields: [
		defineField({
			name: "headline",
			type: "string",
			title: "Headline",
			// description
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			// description
			options: {
				source: "headline",
			},
		}),
		defineField({
			name: "isHiddenFromHomePage",
			type: "isHiddenFromHomePage",
			title: "Hide from home page?",
		}),
		defineField({
			name: "date",
			type: "date",
			title: "Date",
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
					field: "date",
					direction: "desc",
				},
				{
					field: "headline",
					direction: "asc",
				},
			],
		},
		{
			title: "Headline",
			name: "headlineAsc",
			by: [
				{
					field: "headline",
					direction: "asc",
				},
			],
		},
	],
	preview: {
		select: {
			headline: "headline",
			date: "date",
			categoryName: "category.name",
			heroImage: "heroImage",
			introduction: "introduction",
		},
		prepare(selection) {
			const {
				headline,
				date,
				categoryName,
				heroImage,
				introduction,
			} = selection;
			return {
				title: headline,
				subtitle: [categoryName, isoDateToReadableDate(date, true)]?.filter(Boolean)?.join(" • "),
				media: heroImage,
				description: portableTextToPlainText(introduction),
			};
		},
	},
});