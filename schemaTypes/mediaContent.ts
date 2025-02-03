import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "mediaContent",
	type: "array",
	of: [
		defineArrayMember({
			name: "temp",
			type: "object",
			title: "Temp Media Type",
			fields: [
				defineField({
					name: "referenceName",
					type: "referenceName",
					title: "Reference Name",
				}),
			],
		}),
		// defineArrayMember({
		// 	name: "singleSpread",
		// 	type: "object",
		// 	title: "Single Spread",
		// 	// icon
		// 	fieldsets: [
		// 		{
		// 			name: "graphic",
		// 			title: "Graphic",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 		{
		// 			name: "text",
		// 			title: "Text",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 		{
		// 			name: "styling",
		// 			title: "Styling",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 	],
		// 	fields: [
		// 		defineField({
		// 			name: "referenceName",
		// 			type: "referenceName",
		// 			title: "Reference Name",
		// 			// description
		// 		}),
		// 		defineField({
		// 			name: "image",
		// 			type: "image",
		// 			title: "Image",
		// 			// description
		// 			options: {
		// 				storeOriginalFilename: false,
		// 			},
		// 			fieldset: "graphic",
		// 		}),
		// 		defineField({
		// 			name: "imageHotspots",
		// 			type: "imageHotspots",
		// 			title: "Image Hotspots",
		// 			options: {
		// 				imageHotspot: {
		// 					pathRoot: "parent",
		// 					imagePath: "image",
		// 				},
		// 			},
		// 			fieldset: "graphic",
		// 		}),
		// 		defineField({
		// 			name: "headline",
		// 			type: "string",
		// 			title: "Headline",
		// 			// description
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "headlinePlacement",
		// 			type: "headlinePlacement",
		// 			title: "Headline Placement",
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "headlineStyle",
		// 			type: "headlineStyle",
		// 			title: "Headline Style",
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "caption",
		// 			type: "simplePortableText",
		// 			title: "Caption",
		// 			// description
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "padding",
		// 			type: "padding",
		// 			title: "Padding",
		// 			// description
		// 			fieldset: "styling",
		// 		}),
		// 		defineField({
		// 			name: "backgroundColour",
		// 			type: "colour",
		// 			title: "Background Colour",
		// 			// description
		// 			fieldset: "styling",
		// 		}),
		// 		defineField({
		// 			name: "doesHaveBorder",
		// 			type: "doesHaveBorder",
		// 			title: "Add border around image?",
		// 			fieldset: "styling",
		// 		}),
		// 	],
		// }),
		// defineArrayMember({
		// 	name: "diptych",
		// 	type: "object",
		// 	title: "Diptych",
		// 	// icon
		// 	fieldsets: [
		// 		{
		// 			name: "leftGraphic",
		// 			title: "Left Graphic",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 		{
		// 			name: "rightGraphic",
		// 			title: "Right Graphic",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 		{
		// 			name: "text",
		// 			title: "Text",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 		{
		// 			name: "styling",
		// 			title: "Styling",
		// 			options: {
		// 				collapsible: true,
		// 				collapsed: true,
		// 			},
		// 		},
		// 	],
		// 	fields: [
		// 		defineField({
		// 			name: "referenceName",
		// 			type: "referenceName",
		// 			title: "Reference Name",
		// 			// description
		// 		}),
		// 		defineField({
		// 			name: "leftImage",
		// 			type: "image",
		// 			title: "Image",
		// 			// description
		// 			options: {
		// 				storeOriginalFilename: false,
		// 			},
		// 			fieldset: "leftGraphic",
		// 		}),
		// 		defineField({
		// 			name: "leftImageHotspots",
		// 			type: "imageHotspots",
		// 			title: "Image Hotspots",
		// 			options: {
		// 				imageHotspot: {
		// 					pathRoot: "parent",
		// 					imagePath: "leftImage",
		// 				},
		// 			},
		// 			fieldset: "leftGraphic",
		// 		}),
		// 		defineField({
		// 			name: "rightImage",
		// 			type: "image",
		// 			title: "Image",
		// 			// description
		// 			options: {
		// 				storeOriginalFilename: false,
		// 			},
		// 			fieldset: "rightGraphic",
		// 		}),
		// 		defineField({
		// 			name: "rightImageHotspots",
		// 			type: "imageHotspots",
		// 			title: "Image Hotspots",
		// 			options: {
		// 				imageHotspot: {
		// 					pathRoot: "parent",
		// 					imagePath: "rightImage",
		// 				},
		// 			},
		// 			fieldset: "rightGraphic",
		// 		}),
		// 		defineField({
		// 			name: "headline",
		// 			type: "string",
		// 			title: "Headline",
		// 			// description
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "headlineStyle",
		// 			type: "headlineStyle",
		// 			title: "Headline Style",
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "leftCaption",
		// 			type: "simplePortableText",
		// 			title: "Left Caption",
		// 			// description
		// 			fieldset: "text",
		// 		}),
		// 		defineField({
		// 			name: "rightCaption",
		// 			type: "simplePortableText",
		// 			title: "Right Caption",
		// 			// description
		// 			fieldset: "text",
		// 		}),
		// 	],
		// 	components: {
		// 		item: MediaContentItem,
		// 	},
		// }),
	],
});