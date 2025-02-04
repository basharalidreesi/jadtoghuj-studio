import { defineField, defineType } from "sanity";
import { LockIcon, SparklesIcon } from "@sanity/icons";
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
			description: "The title of this project.",
		}),
		defineField({
			name: "slug",
			type: "commonSlug",
			title: "Slug",
			options: {
				source: "title",
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
			description: "The date of this project, mainly used for sorting.",
		}),
		defineField({
			name: "summary",
			type: "simplePortableText",
			title: "Summary",
			description: "A short summary introducing this project.",
		}),
		defineField({
			name: "metadata",
			type: "metadata",
			title: "Metadata",
		}),
		defineField({
			name: "client",
			type: "string",
			title: "Client",
			description: "The client(s) attributed to this project.",
		}),
		defineField({
			name: "category",
			type: "reference",
			title: "Category",
			description: "The category under which this project should be filed.",
			to: [
				{
					type: "category",
				},
			],
		}),
		defineField({
			name: "lookContent",
			type: "lookContent",
			title: "Looks",
			description: "The look(s) attributed to this project.",
		}),
		defineField({
			name: "mediaContent",
			type: "mediaContent",
			title: "Media",
			description: "The media content of this project. Will not be displayed on the project's webpage unless added to the body field below.",
		}),
		defineField({ // TODO consider horizontal?
			name: "bodyContent",
			type: "bodyContent",
			title: "Body",
			description: "The body content of this project.",
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
			isHiddenFromListings: "isHiddenFromListings",
			date: "date",
			client: "client",
			categoryName: "category.name",
			summary: "summary",
			metadata: "metadata",
		},
		prepare(selection) {
			const {
				title,
				isHiddenFromListings,
				date,
				client,
				categoryName,
				summary,
				metadata,
			} = selection;
			return {
				title: [title ? title : "Untitled", metadata?.title ? `(${metadata.title})` : null]?.filter(Boolean)?.join(" ") || undefined,
				subtitle: [categoryName, client, isoDateToReadableDate(date, { isAbbreviated: true, doesIncludeDay: false, doesIncludeMonth: false, }) || null]?.filter(Boolean)?.join(" · ") || undefined,
				description: portableTextToPlainText(summary) || metadata?.description || undefined,
				media: isHiddenFromListings ? LockIcon : (metadata?.openGraphImage || metadata?.twitterImage || undefined),
			};
		},
	},
});