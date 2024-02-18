import { HomeIcon, UlistIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextConfig, slugConfig, stringConfig } from "../util";
import { LINK_ICON } from "./link";

export const LISTING_ICON = UlistIcon;
export const HOMEPAGE_ID = "6e0dca37-eb1e-4329-916d-b1a09c7426bf";
export const HOMEPAGE_TITLE = "Homepage";

export default defineType({
	name: "listing",
	type: "document",
	title: "Listing",
	icon: LISTING_ICON,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "This title of this Listing. This field is required.",
			hidden: ({ document }) => document?._id?.replace("drafts.", "") === HOMEPAGE_ID,
			readOnly: ({ document }) => document?._id?.replace("drafts.", "") === HOMEPAGE_ID,
			validation: (Rule) => Rule.custom((value, context) => {
				if ((!value || value.length === 0) && context.document?._id?.replace("drafts.", "") !== HOMEPAGE_ID) { return stringConfig.requireString(value); };
				return true;
			}),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			description: "The URL-friendly identifier for this Listing, generated from its title. Click on \"Generate\" to create a slug from the title. Changing the slug after the page is published and circulated could lead to broken links and cause accessibility issues for users who have bookmarked or shared the previous URL. This field is required.",
			options: {
				source: "title",
				slugify: slugConfig.customSlugify,
			},
			hidden: ({ document }) => document?._id?.replace("drafts.", "") === HOMEPAGE_ID,
			readOnly: ({ document }) => document?._id?.replace("drafts.", "") === HOMEPAGE_ID,
			validation: (Rule) => Rule.custom((value, context) => {
				if (context.document?._id?.replace("drafts.", "") === HOMEPAGE_ID) { return true; };
				return slugConfig.requireSlug(value);
			}),
		}),
		defineField({
			name: "content",
			type: "array",
			title: "Content",
			description: "This content of this Listing. This field is required. At least one item must be added.",
			of: [
				defineArrayMember({
					name: "contentItem_text",
					type: "object",
					title: "Text",
					icon: portableTextConfig.PORTABLE_TEXT_ICON,
					fields: [
						defineField({
							name: "text",
							type: "portableText",
							title: "Text",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: {
							text: "text",
						},
						prepare(selection) {
							const {
								text,
							} = selection;
							return {
								title: portableTextConfig.renderAsPlainText(text),
								subtitle: "Text",
							};
						},
					},
				}),
				defineArrayMember({
					name: "contentItem_reference",
					type: "reference",
					title: "Reference",
					icon: LINK_ICON,
					to: [
						{ type: "project" },
						{ type: "press" },
					],
					options: {
						disableNew: true,
					},
				}),
			],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: {
			title: "title",
			_id: "_id",
		},
		prepare(selection) {
			const {
				title,
				_id,
			} = selection;
			const id = _id.replace("drafts.", "");
			return {
				title: title,
				media: id === HOMEPAGE_ID ? HomeIcon : null,
			};
		},
	},
});