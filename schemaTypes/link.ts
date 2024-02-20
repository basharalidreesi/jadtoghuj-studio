import { LinkIcon } from "@sanity/icons";
import { ValidationContext, defineField, defineType } from "sanity";

export const LINK_ICON = LinkIcon;

export default defineType({
	name: "link",
	type: "object",
	title: "Link",
	icon: LINK_ICON,
	fields: [
		defineField({
			name: "target",
			type: "string",
			title: "Target Type",
			description: "Specifies whether the target of this link is internal or external. Default value: External.",
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
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "externalTarget",
			type: "url",
			title: "Target",
			description: "The external target of this link.",
			hidden: ({ parent }) => parent?.target !== "external",
			validation: (Rule) => [
				// Rule.custom((value, context: ValidationContext & { parent?: any }) => {
				// 	if (!value && context?.parent?.target === "external") { return "Required"; };
				// 	return true;
				// }),
				Rule.uri({
					scheme: ["http", "https", "mailto", "tel"],
				}),
			],
		}),
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "The title of this external link.",
			hidden: ({ parent }) => parent?.target !== "external",
		}),
		defineField({
			name: "internalTarget",
			type: "reference",
			title: "Target",
			description: "The internal target of this link.",
			to: [
				{ type: "project", },
				{ type: "press", },
				{ type: "listing", },
			],
			weak: true,
			options: {
				disableNew: true,
			},
			hidden: ({ parent }) => parent?.target !== "internal",
			// validation: (Rule) => Rule.custom((value, context: ValidationContext & { parent?: any }) => {
			// 	if (!value && context?.parent?.target === "internal") { return "Required"; };
			// 	return true;
			// }),
		}),
	],
});