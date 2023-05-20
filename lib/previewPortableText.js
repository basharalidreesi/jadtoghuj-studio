// TODO

export default function previewPortableText(portableText) {
	const block = (portableText || []).find((block) => block._type === "block")
	return block ? block.children.filter((child) => 
		(child._type === "span" && child.text)
		|| child._type === "entity"
		|| child._type === "project"
	).map((child) => {
		if (child._type === "span") {
			return child.text
		}
		if (child._type === "entity") {
			// return "[_ref: " + child._ref + "]"
			return "[REF]"
		}
		if (child._type === "project") {
			// return "[_ref: " + child._ref + "]"
			return "[REF]"
		}
	}).join("") : ""
}