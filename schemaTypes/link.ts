import { defineField, defineType } from "sanity";

export default defineType({
	name: "link",
	type: "object",
	fields: [
		defineField({
			name: "type",
			type: "string",
			title: "Type",
			// TODO description
			options: {
				list: [
					{
						value: "external",
						title: "External",
					},
					{
						value: "internal",
						title: "Internal",
					},
				],
				layout: "radio",
				direction: "horizontal",
			},
			initialValue: "external",
		}),
		defineField({
			name: "internalTarget",
			type: "reference",
			title: "Internal Target",
			// TODO description
			to: [
				{
					type: "article",
				},
				{
					type: "category",
				},
				{
					type: "pressItem",
				},
				{
					type: "project",
				},
				{
					type: "homePage",
				},
			],
			options: {
				disableNew: true,
			},
			hidden: ({ parent }) => parent.type !== "internal",
		}),
		defineField({
			name: "externalUrl",
			type: "url",
			title: "External URL",
			// TODO description
			hidden: ({ parent }) => parent.type !== "external",
		}),
	],
});