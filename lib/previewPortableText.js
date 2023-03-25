export function previewPortableText(portableText) {
    const block = (portableText || []).find(block => block._type === "block")
	return block ? block.children.filter(child => (child._type === "span" && child.text) || child._type === "person").map(span => span.text || "[REF]").join("") : ""
}