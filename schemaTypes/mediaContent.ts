import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageHotspotPreview, MediaContentItem, StringListInput } from "../components";

export default defineType({
	name: "mediaContent",
	type: "array",
	title: "Media Content",
	// description
	of: [
		defineArrayMember({
			name: "singleSpread",
			type: "object",
			title: "Single Spread",
			// icon
			fieldsets: [
				{
					name: "graphic",
					title: "Graphic",
					options: {
						collapsible: true,
						collapsed: true,
					},
				},
				{
					name: "text",
					title: "Text",
					options: {
						collapsible: true,
						collapsed: true,
					},
				},
				{
					name: "styling",
					title: "Styling",
					options: {
						collapsible: true,
						collapsed: true,
					},
				},
			],
			fields: [
				defineField({
					name: "referenceName",
					type: "string",
					title: "Reference Name",
					// description
				}),
				defineField({
					name: "isMarkedAsNewLook",
					type: "boolean",
					title: "Mark as new look?",
					// description
					options: {
						layout: "checkbox",
					},
					initialValue: false,
				}),
				defineField({
					name: "image",
					type: "image",
					title: "Image",
					// description
					options: {
						storeOriginalFilename: false,
					},
					fieldset: "graphic",
				}),
				defineField({
					name: "imageHotspots",
					type: "array",
					of: [
						defineArrayMember({
							type: "imageHotspot",
						}),
					],
					options: {
						imageHotspot: {
							pathRoot: "parent",
							imagePath: "image",
							tooltip: ImageHotspotPreview,
						},
					},
					fieldset: "graphic",
				}),
				defineField({
					name: "headline",
					type: "string",
					title: "Headline",
					// description
					fieldset: "text",
				}),
				defineField({
					name: "headlinePlacement",
					type: "string",
					title: "Headline Placement",
					// description
					options: {
						list: [
							{
								value: "above",
								title: "Above",
							},
							{
								value: "below",
								title: "Below",
							},
							{
								value: "inside-top",
								title: "In-Top",
							},
							{
								value: "inside-bottom",
								title: "In-Bottom",
							},
							{
								value: "inside-left",
								title: "In-Left",
							},
							{
								value: "inside-right",
								title: "In-Right",
							},
						],
						layout: "radio",
					},
					initialValue: "above",
					components: {
						input: StringListInput,
					},
					fieldset: "text",
				}),
				defineField({
					name: "headlineStyle",
					type: "string",
					title: "Headline Style",
					// description
					options: {
						list: [
							{
								value: "var1",
								title: "Variant 1",
							},
							{
								value: "var2",
								title: "Variant 2",
							},
						],
						layout: "radio",
					},
					initialValue: "var1",
					components: {
						input: StringListInput,
					},
					fieldset: "text",
				}),
				defineField({
					name: "caption",
					type: "simplePortableText",
					title: "Caption",
					// description
					fieldset: "text",
				}),
				defineField({
					name: "padding",
					type: "padding",
					title: "Padding",
					// description
					fieldset: "styling",
				}),
				defineField({
					name: "backgroundColour",
					type: "colour",
					title: "Background Colour",
					// description
					fieldset: "styling",
				}),
				defineField({
					name: "doesHaveBorder",
					type: "boolean",
					title: "Add border around image?",
					// description
					options: {
						layout: "checkbox",
					},
					initialValue: false,
					fieldset: "styling",
				}),
			],
			components: {
				item: MediaContentItem,
			},
		}),
	],
});