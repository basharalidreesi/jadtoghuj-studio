import { defineArrayMember, defineField, defineType, useFormValue, ValidationContext } from "sanity";
import { styles, lists, decorators, annotations } from "../utils/portableTextUtils";
import { ImageIcon } from "@sanity/icons";
import { AsyncSelectInput, SelectedMediaContentPreview } from "../components";

export default defineType({
	name: "bodyContent",
	type: "array",
	title: "Body Content",
	// description
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				styles.normal,
			],
			lists: [
				lists.bullets,
				lists.numbers,
			],
			marks: {
				decorators: [
					decorators.strong,
					decorators.em,
					decorators.underline,
					decorators.strikeThrough,
				],
				annotations: [
					annotations.link,
				],
			},
		}),
		defineArrayMember({
			name: "selectedMediaContent",
			type: "object",
			title: "Selected Media",
			icon: ImageIcon,
			fields: [
				defineField({
					name: "selectedMediaContentItems",
					type: "array",
					title: "Selected Media",
					// description
					of: [
						{
							type: "string",
							options: {
								list: [],
								// @ts-ignore
								sourceField: "/mediaContent",
								// @ts-ignore
								formatResponse: (res) => res?.map((item) => ({
									title: item.referenceName || "Untitled",
									value: `{"mediaContentItemKey":"${item._key}"}`,
								})),
							},
							components: {
								input: AsyncSelectInput,
							},
						},
					],
				}),
				defineField({
					name: "isConstrainedIfSingleToBody",
					type: "boolean",
					title: "Constrain single to body?",
					// description
					options: {
						layout: "checkbox",
					},
					initialValue: false,
				}),
			],
			preview: {
				select: {
					selectedMediaContentItems: "selectedMediaContentItems",
				},
			},
			components: {
				preview: SelectedMediaContentPreview,
			},
		}),
	],
});