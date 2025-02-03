import { defineType } from "sanity";
import { StringListInput } from "../components";

export default defineType({
	name: "headlineStyle",
	type: "string",
	// TODO description
	options: {
		list: [ // TODO define
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
});