// TODO

export default function PortableTextPreview(portableText) {
	const block = (portableText || []).find((block) => block._type === "block")
	return block ? block.children.filter((child) => (child._type === "span" && child.text) || child._type === "entity").map((child) => {
		if (child._type === "span") {
			return child.text
		}
		if (child._type === "entity") {
			// return "[_ref: " + child._ref + "]"
			return "[REF]"
		}
	}).join("") : ""
}