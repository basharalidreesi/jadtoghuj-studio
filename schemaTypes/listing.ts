import { HomeIcon, UlistIcon } from "@sanity/icons";
import { PreviewProps, defineArrayMember, defineField, defineType } from "sanity";
import { imageConfig, portableTextConfig, slugConfig, stringConfig, urlConfig } from "../util";
import { LINK_ICON } from "./link";
import { EMBED_ICON, IMAGE_ICON } from "./project";

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
				defineArrayMember({
					name: "contentItem_image",
					type: "image",
					title: "Image",
					icon: IMAGE_ICON,
					options: imageConfig.options,
					fields: [
						defineField({
							name: "size",
							type: "string",
							title: "Size",
							description: "The display size of this image. Default value: Large.",
							options: {
								list: [
									{
										value: "small",
										title: "Small",
									},
									{
										value: "medium",
										title: "Medium",
									},
									{
										value: "large",
										title: "Large",
									},
								],
								layout: "radio",
								direction: "horizontal",
							},
							initialValue: "large",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "link",
							type: "link",
							title: "Link",
							description: "The link to which this image leads. This field is optional.",
						}),
					],
					validation: (Rule) => Rule.custom(imageConfig.requireAsset),
					preview: {
						select: {
							asset: "asset",
							size: "size",
							target: "link.target",
							externalTarget: "link.externalTarget",
							title: "link.title",
							internalTargetTitle: "link.internalTarget.title",
						},
						prepare(selection) {
							const {
								asset,
								size,
								target,
								externalTarget,
								title,
								internalTargetTitle,
							} = selection;
							return {
								title: ["Image", title && `(${title})`]?.filter(Boolean)?.join(" "),
								subtitle: [`${size?.charAt(0)?.toUpperCase()}${size?.slice(1)}`, target === "external" && externalTarget && `→ ${externalTarget}`, target === "internal" && internalTargetTitle && `→ ${internalTargetTitle}`]?.filter(Boolean)?.join(", "),
								media: asset,
							};
						},
					},
				}),
				defineArrayMember({
					name: "contentItem_embed",
					type: "object",
					title: "Embed",
					icon: EMBED_ICON,
					fields: [
						defineField({
							name: "url",
							type: "url",
							title: "URL",
							description: "The URL linking to this embed. This field is required. Only YouTube, Vimeo, Spotify, Instagram, and TikTok URLs are supported.",
							validation: (Rule) => Rule.custom((value) => urlConfig.validateUrlByHosts(value, ["YouTube", "Vimeo", "Spotify", "Instagram", "TikTok"])),
						}),
						defineField({
							name: "aspectRatio",
							type: "string",
							title: "Aspect Ratio",
							description: "The aspect ratio (width ÷ height) of the embed. This field is required. Default value: 16/9.",
							initialValue: "16/9",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: {
							url: "url",
							aspectRatio: "aspectRatio",
						},
					},
					components: {
						preview: (props: PreviewProps & { url?: string; aspectRatio?: string; }) => {
							const thumbnail = props.url ? urlConfig.getThumbnailFromVideoUrl(props.url, "cover") : null;
							return props.renderDefault({
								...props,
								title: "Embed",
								subtitle: [props.aspectRatio, props.url && `→ ${props.url}`]?.filter(Boolean)?.join(", "),
								/** @ts-ignore */
								media: thumbnail || EMBED_ICON,
							});
						},
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