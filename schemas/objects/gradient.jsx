import { defineField } from "sanity"
import { ColourPreview, GradientPreview } from "../../components"

export default defineField({
	name: "gradient",
	type: "object",
	title: "Gradient",
	fields: [
		defineField({
			name: "top",
			type: "string",
			title: "Top",
			description: "",
			initialValue: "#ffffff",
			components: {
				input: (props) => <ColourPreview withDefault={true} colour={props.value} {...props} />,
			},
		}),
		defineField({
			name: "bottom",
			type: "string",
			title: "Bottom",
			description: "",
			initialValue: "#ffffff",
			components: {
				input: (props) => <ColourPreview withDefault={true} colour={props.value} {...props} />,
			},
		}),
		defineField({
			name: "text",
			type: "string",
			title: "Text",
			description: "",
			initialValue: "#000000",
			components: {
				input: (props) => <ColourPreview withDefault={true} colour={props.value} {...props} />,
			},
		}),
	],
	components: {
		input: (props) => <GradientPreview withDefault={true} colour1={props.value?.text} colour2={props.value?.top} colour3={props.value?.bottom} {...props} />,
	},
})