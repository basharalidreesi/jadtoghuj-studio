import { defineField } from "sanity"
import { ColourPreview, GradientPreview } from "../../components"
import { checkIfValueIsAValidCssColour } from "../../lib"

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
			validation: (Rule) => Rule.custom(checkIfValueIsAValidCssColour),
			components: {
				input: (props) => <ColourPreview options={{ withDefault: true, colour: props.value, placeholder: "#ffffff" }} {...props} />,
			},
		}),
		defineField({
			name: "bottom",
			type: "string",
			title: "Bottom",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueIsAValidCssColour),
			components: {
				input: (props) => <ColourPreview options={{ withDefault: true, colour: props.value, placeholder: "#ffffff" }} {...props} />,
			},
		}),
		defineField({
			name: "text",
			type: "string",
			title: "Text",
			description: "",
			validation: (Rule) => Rule.custom(checkIfValueIsAValidCssColour),
			components: {
				input: (props) => <ColourPreview options={{ withDefault: true, colour: props.value, placeholder: "#000000", }} {...props} />,
			},
		}),
	],
	components: {
		input: (props) => <GradientPreview options={{ withDefault: true, colour1: props.value?.text, colour2: props.value?.top, colour3: props.value?.bottom }} {...props} />,
	},
})