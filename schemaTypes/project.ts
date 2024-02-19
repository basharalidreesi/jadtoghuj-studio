import { PortableTextBlock, PreviewProps, ValidationContext, defineArrayMember, defineField, defineType, useFormValue } from "sanity";
import { AsteriskIcon, DiamondIcon, ImageIcon, SparklesIcon } from "@sanity/icons";
import { imageConfig, portableTextConfig, slugConfig, stringConfig, urlConfig } from "../util";
import { MediaColorInput, MediaItem } from "../components";
import { SanityAsset } from "@sanity/image-url/lib/types/types";

export const PROJECT_TITLE = "Project";
export const PROJECT_ICON = DiamondIcon;
export const IMAGE_ICON = ImageIcon;
export const EMBED_ICON = AsteriskIcon;
export const LOOK_ICON = SparklesIcon;

export default defineType({
	name: "project",
	type: "document",
	title: PROJECT_TITLE,
	icon: PROJECT_ICON,
	fieldsets: [
		{
			name: "color-settings",
			options: {
				columns: 2,
			},
		},
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "The title of this Project. This field is required.",
			validation: (Rule) => Rule.custom(stringConfig.requireString),
		}),
		defineField({
			name: "slug",
			type: "slug",
			title: "Slug",
			description: "The URL-friendly identifier for this Project, generated from its title. Click on \"Generate\" to create a slug from the title. Changing the slug after the page is published and circulated could lead to broken links and cause accessibility issues for users who have bookmarked or shared the previous URL. This field is required.",
			options: {
				source: "title",
				slugify: slugConfig.customSlugify,
			},
			validation: (Rule) => Rule.custom(slugConfig.requireSlug),
		}),
		defineField({
			name: "date",
			type: "date",
			title: "Year",
			options: {
				dateFormat: "YYYY",
			},
			description: "The year attributed to this Project. This field is required.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			type: "portableText",
			title: "Description",
			description: "A brief description or summary of this Project. Will appear on the Project's page, in social media shares, and in Google Search results. This field is optional, but its completion is highly encouraged.",
		}),
		// credits somehow
		defineField({
			name: "media",
			type: "array",
			title: "Media",
			description: "Media attributed to this Project. This field is optional.",
			of: [
				defineArrayMember({
					name: "image",
					type: "image",
					title: "Image",
					icon: IMAGE_ICON,
					options: imageConfig.options,
					validation: (Rule) => Rule.custom(imageConfig.requireAsset),
					preview: {
						select: {
							_key: "_key",
							asset: "asset",
						},
					},
					components: {
						item: MediaItem,
						preview: (props: PreviewProps & { _key?: string; asset?: SanityAsset; }) => {
							const mediaArray = useFormValue(["media"]) as { _key?: string; }[];
							const currentIndex = mediaArray?.findIndex((mediaArrayItem) => mediaArrayItem._key === props._key);
							const thumbnail = props.asset ? imageConfig.getThumbnailFromSanityAsset(props.asset, 500) : null;
							return props.renderDefault({
								...props,
								title: `Slide ${currentIndex + 1}`,
								/** @ts-ignore */
								media: thumbnail || IMAGE_ICON,
								description: "Image",
								layout: "detail",
							});
						},
					},
				}),
				defineArrayMember({
					name: "video",
					type: "object",
					title: "Video",
					icon: EMBED_ICON,
					fields: [
						defineField({
							name: "url",
							type: "url",
							title: "URL",
							description: "The URL linking to this video. This field is required. Only YouTube and Vimeo URLs are supported.",
							validation: (Rule) => Rule.custom((value) => {
								if (!value) { return "Required"; };
								try {
									const hostname = new URL(value)?.hostname?.replace("www.", "");
									if (hostname !== "youtube.com" && hostname !== "youtu.be" && hostname !== "vimeo.com") {
										return "Not a valid YouTube or Vimeo URL";
									};
								} catch {
									return "Not a valid URL";
								};
								return true;
							}),
						}),
						defineField({
							name: "aspectRatio",
							type: "string",
							title: "Aspect Ratio",
							description: "The aspect ratio (width ÷ height) of the video. This field is required. Default value: 16/9.",
							initialValue: "16/9",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: {
							_key: "_key",
							url: "url",
						},
					},
					components: {
						item: MediaItem,
						preview: (props: PreviewProps & { _key?: string; url?: string; }) => {
							const mediaArray = useFormValue(["media"]) as { _key?: string; }[];
							const currentIndex = mediaArray?.findIndex((mediaArrayItem) => mediaArrayItem._key === props._key);
							const thumbnail = props.url ? urlConfig.getThumbnailFromVideoUrl(props?.url, "contain") : null;
							return props.renderDefault({
								...props,
								title: `Slide ${currentIndex + 1}`,
								/** @ts-ignore */
								media: thumbnail || EMBED_ICON,
								description: "Video",
								layout: "detail",
							});
						},
					},
				}),
			],
		}),
		defineField({
			name: "looks",
			type: "array",
			title: "Looks",
			description: "Looks attributed to this Project. This field is optional.",
			of: [
				defineArrayMember({
					name: "image",
					type: "image",
					title: "Look",
					icon: LOOK_ICON,
					options: imageConfig.options,
					fields: [
						defineField({
							name: "description",
							type: "portableText",
							title: "Description",
							description: "A brief summary or description of this look. This field is optional.",
						}),
					],
					preview: {
						select: {
							_key: "_key",
							asset: "asset",
							description: "description",
						},
					},
					components: {
						/** @ts-ignore */
						preview: (props: PreviewProps & { _key?: string; asset?: SanityAsset; description?: PortableTextBlock[]; }) => {
							const looksArray = useFormValue(["looks"]) as { _key?: string; }[];
							const currentIndex = looksArray?.findIndex((looksArrayItem) => looksArrayItem._key === props._key);
							const thumbnail = props.asset ? imageConfig.getThumbnailFromSanityAsset(props.asset, 500) : null;
							return props.renderDefault({
								...props,
								title: `Look ${currentIndex + 1}`,
								/** @ts-ignore */
								media: thumbnail || LOOK_ICON,
								description: portableTextConfig.renderAsPlainText(props.description),
								layout: "detail",
							});
						},
					},
				}),
			],
		}),
		defineField({
			name: "color",
			type: "string",
			title: "Color",
			description: "The color that represents this Project. This field is required.",
			validation: (Rule) => [
				Rule.custom((value, context: ValidationContext & { parent?: any; }) => {
					if (!value && context.parent?.doesHaveCustomColor) { return "Required"; };
					return true;
				}),
				Rule.custom(stringConfig.isValidCssColourString),
			],
			initialValue: stringConfig.DEFAULT_BACKGROUND_COLOR,
			fieldset: "color-settings",
			components: {
				input: MediaColorInput,
			},
		}),
		defineField({
			name: "doesHaveCustomColor",
			type: "boolean",
			title: "Custom color?",
			options: {
				layout: "checkbox",
			},
			initialValue: false,
			validation: (Rule) => Rule.required(),
			fieldset: "color-settings",
		}),
		defineField({
			name: "relatedPress",
			type: "array",
			title: "Related Press",
			description: "Press items related to this Project. This field is optional.",
			of: [
				defineArrayMember({
					type: "reference",
					title: "Press Item",
					to: [{ type: "press", }],
				}),
			],
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
			mediaArray: "media",
			looksArray: "looks",
			description: "description",
		},
		prepare(selection) {
			const {
				title,
				date,
				mediaArray,
				looksArray,
				description,
			} = selection;
			const firstMediaArrayItem = mediaArray?.[0];
			const imageThumbnail = firstMediaArrayItem?._type === "image" ? firstMediaArrayItem?.asset || null : null;
			const videoThumbnail = firstMediaArrayItem?._type === "video" ? urlConfig.getThumbnailFromVideoUrl(firstMediaArrayItem?.url, "cover") || null : null;
			return {
				title: title,
				subtitle: [
					date && date.split("-")?.[0] || null,
					mediaArray && mediaArray.length !== 0 && `${mediaArray.length} slide${mediaArray.length === 1 ? "" : "s"}` || null,
					looksArray && looksArray.length !== 0 && `${looksArray.length} look${looksArray.length === 1 ? "" : "s"}` || null,
				]?.filter(Boolean)?.join(", "),
				media: imageThumbnail || videoThumbnail,
				description: portableTextConfig.renderAsPlainText(description),
			};
		},
	},
});