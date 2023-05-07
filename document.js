const singletonIds = new Set(["homepage"])
const singletonTypes = new Set(["settings"])
const singletonActions = new Set(["publish", "discardChanges", "restore"])

export const newDocumentOptions = (prev) => {
	return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
}

export const actions = (prev, context) =>
	singletonTypes.has(context.schemaType) || singletonIds.has(context.documentId)
		? prev.filter(({ action }) => action && singletonActions.has(action))
		: prev