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
			description: "The name of this category.",
		}),
		defineField({
			name: "slug",
			type: "commonSlug",
			title: "Slug",
			options: {
				source: "name",
			},
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
	preview: {
		select: {
			name: "name",
			slug: "slug",
			metadata: "metadata",
		},
		prepare(selection) {
			const {
				name,
				slug,
				metadata,
			} = selection;
			return {
				title: [name ? name : "Untitled", metadata?.title ? `(${metadata.title})` : null]?.filter(Boolean)?.join(" ") || undefined,
				subtitle: slug?.current || undefined,
				description: metadata?.description || undefined,
				media: metadata?.openGraphImage || metadata?.twitterImage || undefined,
			};
		},
	},
});