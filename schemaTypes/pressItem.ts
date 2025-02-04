import { defineField, defineType } from "sanity";
import { ConfettiIcon, LockIcon } from "@sanity/icons";
import { isoDateToReadableDate } from "../utils/dateUtils";

export default defineType({
	name: "pressItem",
	type: "document",
	title: "Press Item",
	icon: ConfettiIcon,
	fields: [
		defineField({
			name: "headline",
			type: "string",
			title: "Headline",
			description: "The title of this press item.",
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "The URL linking to this press item.",
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
			description: "The date of this press item.",
		}),
		defineField({
			name: "publisher",
			type: "string",
			title: "Publisher",
			description: "The publisher of this press item.",
		}),
		defineField({
			name: "heroImage",
			type: "heroImage",
			title: "Hero Image",
		}),
		defineField({
			name: "category",
			type: "reference",
			title: "Category",
			description: "The category under which this press item should be filed.",
			to: [
				{
					type: "category",
				},
			],
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
		{
			title: "Publisher",
			name: "publisherAsc",
			by: [
				{
					field: "publisher",
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
			categoryName: "category.name",
			publisher: "publisher",
			heroImage: "heroImage",
		},
		prepare(selection) {
			const {
				headline,
				isHiddenFromListings,
				date,
				categoryName,
				publisher,
				heroImage,
			} = selection;
			return {
				title: headline || undefined,
				subtitle: [categoryName, publisher, isoDateToReadableDate(date, { isAbbreviated: true, })]?.filter(Boolean)?.join(" · ") || undefined,
				media: isHiddenFromListings ? LockIcon : (heroImage || undefined),
			};
		},
	},
});