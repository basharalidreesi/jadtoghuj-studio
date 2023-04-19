import { colourPreview } from "../../components/colourPreview"
import { gradientPreview } from "../../components/gradientPreview"

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
				input: colourPreview,
			},
		},
		{
			name: "bottom",
			type: "string",
			title: "Bottom",
			description: "",
			initialValue: "#91a3b0",
			components: {
				input: colourPreview,
			},
		},
		{
			name: "text",
			type: "string",
			title: "Text",
			description: "",
			initialValue: "#000000",
			components: {
				input: colourPreview,
			},
		},
	],
	components: {
		input: gradientPreview,
	},
}