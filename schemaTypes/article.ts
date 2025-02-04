import { defineField, defineType } from "sanity";
import { BookIcon, LockIcon } from "@sanity/icons";
import { isoDateToReadableDate } from "../utils/dateUtils";
import { portableTextToPlainText } from "../utils/portableTextUtils";

export default defineType({
	name: "article",
	type: "document",
	title: "Article",
	icon: BookIcon,
	fields: [
		defineField({
			name: "headline",
			type: "string",
			title: "Headline",
			description: "The title of this article.",
		}),
		defineField({
			name: "slug",
			type: "commonSlug",
			title: "Slug",
			options: {
				source: "headline",
			},
		}),
		defineField({
			name: "isHiddenFromListings",
			type: "isHiddenFromListings",
			title: "Hide from listings?",
		}),
		defineField({
			name: "date",
			type: "date",
			title: "Date",
			description: "The date of this article, mainly used for sorting.",
		}),
		defineField({
			name: "summary",
			type: "simplePortableText",
			title: "Summary",
			description: "A short summary introducing this article.",
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
			// TODO description
		}),
		defineField({
			name: "metadata",
			type: "metadata",
			title: "Metadata",
		}),
		defineField({
			name: "category",
			type: "reference",
			title: "Category",
			description: "The category under which this article should be filed.",
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
			description: "The media content of this article. Will not be displayed on the article's webpage unless added to the body field below.",
		}),
		defineField({
			name: "bodyContent",
			type: "bodyContent",
			title: "Body",
			description: "The body content of this article.",
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
			isHiddenFromListings: "isHiddenFromListings",
			date: "date",
			metadata: "metadata",
			categoryName: "category.name",
			summary: "summary",
			heroImage: "heroImage",
		},
		prepare(selection) {
			const {
				headline,
				isHiddenFromListings,
				date,
				metadata,
				categoryName,
				summary,
				heroImage,
			} = selection;
			return {
				title: [headline ? headline : "Untitled", metadata?.title ? `(${metadata.title})` : null]?.filter(Boolean)?.join(" ") || undefined,
				subtitle: [categoryName, isoDateToReadableDate(date, { isAbbreviated: true, })]?.filter(Boolean)?.join(" · ") || undefined,
				description: portableTextToPlainText(summary) || metadata?.description || undefined,
				media: isHiddenFromListings ? LockIcon : (heroImage || metadata?.openGraphImage || metadata?.twitterImage || undefined),
			};
		},
	},
});