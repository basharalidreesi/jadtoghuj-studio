import { defineArrayMember, defineField, defineType, } from "sanity";
import { portableTextStyles, portableTextLists, portableTextDecorators, portableTextAnnotations } from "../utils/portableTextUtils";
import { AsteriskIcon, PinIcon } from "@sanity/icons";
import { AsyncSelectInput, NoteField, SelectMediaPreview } from "../components";

export default defineType({
	name: "bodyContent",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				portableTextStyles.normal,
			],
			lists: [
				portableTextLists.bullets,
				portableTextLists.numbers,
			],
			marks: {
				decorators: [
					portableTextDecorators.strong,
					portableTextDecorators.em,
					portableTextDecorators.underline,
					portableTextDecorators.strikeThrough,
				],
				annotations: [
					portableTextAnnotations.link,
				],
			},
		}),
		defineArrayMember({
			name: "allMediaPlaceholder",
			type: "object",
			title: "All Media",
			icon: AsteriskIcon,
			fields: [
				defineField({
					name: "internal_unused",
					type: "string",
					description: "This block is a placeholder for all media items listed above. It will be swapped out with them in the same order they appear. If you want to choose which media items appear, use Select Media instead.",
					readOnly: true,
					initialValue: "dummy value",
					components: {
						field: NoteField,
					},
				}),
			],
			preview: {
				prepare() {
					return {
						title: "All Media (Placeholder)",
					};
				},
			},
		}),
		defineArrayMember({
			name: "selectMediaContent",
			type: "object",
			title: "Select Media",
			icon: PinIcon,
			fields: [
				defineField({
					name: "selectMediaItems",
					type: "array",
					title: "Select Media",
					// description
					of: [
						defineArrayMember({
							type: "string",
							options: {
								list: [],
								// @ts-ignore
								sourceField: "/mediaContent",
								// @ts-ignore
								formatResponse: (res) => res?.map((item) => ({
									title: item.referenceName || `Untitled media item ${item._key}`,
									value: `{"mediaItemKey":"${item._key}"}`,
								})),
							},
							components: {
								input: AsyncSelectInput,
							},
						}),
					],
					validation: (Rule) => Rule.custom((value, context) => {
						if (!value) { return true; };
						const sourceFieldItems = context.document?.mediaContent || [];
						const selectedKeys = value?.map((item) => {
							try {
								// @ts-ignore
								const parsed = JSON.parse(item);
								return parsed.mediaItemKey;
							} catch (error) {
								return null;
							};
						}).filter(Boolean);
						// @ts-ignore
						const missingItems = selectedKeys?.filter((key) => !sourceFieldItems.some((item) => item._key === key));
						return missingItems?.length === 0 ? true : "One or more selected items are no longer available in the media field";
					}).warning(),
				}),
				// defineField({
				// 	name: "isConstrainedIfSingleToBody",
				// 	type: "boolean",
				// 	title: "Constrain single to body?",
				// 	// description
				// 	options: {
				// 		layout: "checkbox",
				// 	},
				// 	initialValue: false,
				// }),
			],
			preview: {
				select: {
					selectMediaItems: "selectMediaItems",
				},
			},
			components: {
				preview: SelectMediaPreview,
			},
		}),
	],
	initialValue: [
		{
			_type: "allMediaPlaceholder",
		},
	],
	validation: (Rule) => Rule.custom((value) => {
		if (!value) { return true; };
		// @ts-ignore
		const allMediaCount = value.filter((item) => item._type === "allMediaPlaceholder").length;
		const hasAllMedia = allMediaCount > 0;
		// @ts-ignore
		const hasSelectMedia = value.some((item) => item._type === "selectMediaContent");
		let warnings = [];
		if (hasAllMedia && hasSelectMedia) {
			warnings.push("Combining All Media with Select Media will lead to duplicate content.");
		};
		if (allMediaCount > 1) {
			warnings.push("Multiple All Media blocks will lead to duplicate content.");
		};
		return warnings.length ? warnings.join(" ") : true;
	}).warning(),
});