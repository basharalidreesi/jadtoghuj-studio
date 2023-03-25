export const newDocumentOptions = (prev) => {
	return prev.filter((templateItem) => !(
		templateItem.templateId.includes("settings-")
		|| templateItem.templateId === "page"
	))
}