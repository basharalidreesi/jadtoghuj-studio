export default function checkIfValueIsAValidCssColour(value) {
	if (!value) { return true }
	const s = new Option().style
	s.color = value
	if (["", "inherit", "initial", "transparent", "unset"].includes(s.color)) { return "Not a valid colour." }
	return true
}