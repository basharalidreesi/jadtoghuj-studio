import { defineField, defineType } from "sanity";
import { ConfettiIcon } from "@sanity/icons";
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
			// description
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			// description
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
			// description
		}),
		defineField({
			name: "publisher",
			type: "string",
			title: "Publisher",
			// description
		}),
		defineField({
			name: "heroImage",
			type: "heroImage",
			title: "Hero Image",
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
			date: "date",
			categoryName: "category.name",
			publisher: "publisher",
			heroImage: "heroImage",
		},
		prepare(selection) {
			const {
				headline,
				date,
				categoryName,
				publisher,
				heroImage,
			} = selection;
			return {
				title: headline,
				subtitle: [categoryName, publisher, isoDateToReadableDate(date, { isAbbreviated: true, })]?.filter(Boolean)?.join(" · "),
				media: heroImage,
			};
		},
	},
});