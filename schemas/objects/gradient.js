import { ColouredInput, gradientPreview } from "../../components"

export default {
	name: "gradient",
	type: "object",
	title: "Gradient",
	fields: [
		{
			name: "top",
			type: "string",
			title: "Top",
			description: "",
			initialValue: "#ffffff",
			components: {
				input: ColouredInput,
			},
		},
		{
			name: "bottom",
			type: "string",
			title: "Bottom",
			description: "",
			initialValue: "#ffffff",
			components: {
				input: ColouredInput,
			},
		},
		{
			name: "text",
			type: "string",
			title: "Text",
			description: "",
			initialValue: "#000000",
			components: {
				input: ColouredInput,
			},
		},
	],
	components: {
		input: gradientPreview,
	},
	options: {
		colour1: "text",
		colour2: "top",
		colour3: "bottom",
	},
}