import { defineType } from "sanity";
import { StringListInput } from "../components";

export default defineType({
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
				value: "inside-vertical",
				title: "In-Vertical",
			},
		],
		layout: "radio",
	},
	initialValue: "above",
	components: {
		input: StringListInput,
	},
});