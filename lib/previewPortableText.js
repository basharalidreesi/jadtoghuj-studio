// TODO

export default function previewPortableText(portableText) {
	const block = (portableText || []).find((block) => block._type === "block")
	const references = [
		"entity",
		"project",
		"press",
	]
	return block ? block.children.filter((child) => 
		(child._type === "span" && child.text)
		|| references.includes(child._type)
	).map((child) => {
		if (child._type === "span") {
			return child.text
		}
		if (references.includes(child._type)) {
			return "[REF]"
		}
	}).join("") : ""
}