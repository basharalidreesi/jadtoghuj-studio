const singletonActions = new Set(["publish", "discardChanges", "restore"])

const singletonTypes = new Set(["settings"])

export const actions = (input, context) =>
	singletonTypes.has(context.schemaType)
		? input.filter(({ action }) => action && singletonActions.has(action))
		: input