import { defineArrayMember, defineField } from "sanity";
import { portableTextConfig } from "../util";

const styles = [
	portableTextConfig.styles.normal,
];

const lists: never[] = [];

const decorators = [
	portableTextConfig.decorators.strong,
	portableTextConfig.decorators.em,
	portableTextConfig.decorators.underline,
	portableTextConfig.decorators.strikeThrough,
	portableTextConfig.decorators.sup,
];

const annotations = [
	portableTextConfig.annotations.link,
];

export default defineField({
	name: "portableText",
	type: "array",
	title: "Portable Text",
	of: [
		defineArrayMember({
			type: "block",
			styles: styles,
			lists: lists,
			marks: {
				decorators: decorators,
				annotations: annotations,
			},
		}),
	],
});