export const newDocumentOptions = (prev, { creationContext }) => {
	if (creationContext.type === "global") {
		return prev.filter((templateItem) => !(
			templateItem.templateId.includes("settings-")
			|| templateItem.templateId === "page"
		))
	}
	return prev
}