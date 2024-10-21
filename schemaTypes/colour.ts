import { defineType } from "sanity";
import { ColourInput } from "../components";

export default defineType({
	name: "colour",
	type: "string",
	title: "Colour",
	// description
	validation: (Rule) => Rule.custom((value?: string) => {
		if (!value) { return true; };
		const s = new Option().style;
		s.color = value;
		if (["", "inherit", "initial", "transparent", "unset"].includes(s.color)) { return "Not a valid colour"; };
		return true;
	}).warning(),
	// initialValue: "#ffffff",
	components: {
		input: ColourInput,
	},
});