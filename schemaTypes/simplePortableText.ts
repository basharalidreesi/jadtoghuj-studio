import { defineArrayMember, defineType } from "sanity";
import { styles, decorators, annotations } from "../utils/portableTextUtils.js";

export default defineType({
	name: "simplePortableText",
	type: "array",
	title: "Simple Portable Text",
	// description
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				styles.normal,
			],
			lists: [],
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
	],
});