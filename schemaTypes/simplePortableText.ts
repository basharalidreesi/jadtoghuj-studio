import { defineArrayMember, defineType } from "sanity";
import { portableTextStyles, portableTextDecorators, portableTextAnnotations } from "../utils/portableTextUtils";

export default defineType({
	name: "simplePortableText",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				portableTextStyles.normal,
			],
			lists: [],
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
	],
});