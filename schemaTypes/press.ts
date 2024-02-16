import { defineField, defineType } from "sanity";
import { ConfettiIcon } from "@sanity/icons";
import { dateConfig, imageConfig, stringConfig } from "../util";

export const PRESS_TITLE = "Press";
export const PRESS_ICON = ConfettiIcon;

export default defineType({
	name: "press",
	type: "document",
	title: PRESS_TITLE,
	icon: PRESS_ICON,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "The title of this Press item. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
		}),
		defineField({
			name: "publisher",
			type: "string",
			title: "Publisher",
			description: "The publisher of this Press item. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
		}),
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "The URL linking to this Press item. This field is required.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "date",
			type: "date",
			title: "Date Published",
			description: "The publishing date of this Press item. This field is optional.",
			options: {
				dateFormat: dateConfig.dateFormat,
			},
		}),
		defineField({
			name: "image",
			type: "image",
			title: "Image",
			description: "The image that represents this Press item. This field is optional.",
			options: imageConfig.options,
		}),
	],
	orderings: [
		{
			name: "titleAsc",
			title: "Title",
			by: [
				{
					field: "title",
					direction: "asc",
				},
				{
					field: "date",
					direction: "desc",
				},
				{
					field: "publisher",
					direction: "asc",
				},
			],
		},
		{
			name: "publisherAsc",
			title: "Publisher",
			by: [
				{
					field: "publisher",
					direction: "asc",
				},
				{
					field: "date",
					direction: "desc",
				},
				{
					field: "title",
					direction: "asc",
				},
			],
		},
		{
			name: "dateDesc",
			title: "Date",
			by: [
				{
					field: "date",
					direction: "desc",
				},
				{
					field: "publisher",
					direction: "asc",
				},
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
			date: "date",
			publisher: "publisher",
			image: "image",
		},
		prepare(selection) {
			const {
				title,
				date,
				publisher,
				image,
			} = selection;
			return {
				title: title,
				subtitle: [date?.split("-")?.[0] || null, publisher]?.filter(Boolean)?.join(", "),
				media: image,
			};
		},
	},
});