import { defineType } from "sanity";
import { NumberListInput } from "../components";

export default defineType({
	name: "padding",
	type: "number",
	// TODO description
	initialValue: 0,
	validation: (rule) => rule.min(0).max(4),
	components: {
		input: NumberListInput,
	},
});