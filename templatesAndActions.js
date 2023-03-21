import { supportedWebsites } from "./lib/websites"

const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["settings"])

export const templates = (prev) => [
	...prev.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
	...supportedWebsites.map(website => {
		return {
			id: `page-for-${website.value}`,
			title: `Page for ${website.title}`,
			schemaType: "page",
			value: {
				"website": website.value,
			},
		}
	}),
	...supportedWebsites.map(website => {
		return {
			id: `settings-for-${website.value}`,
			title: `Settings for ${website.title}`,
			schemaType: "settings",
			value: {
				"website": website.value,
			},
		}
	}),
]

export const actions = (input, context) =>
	singletonTypes.has(context.schemaType)
		? input.filter(({ action }) => action && singletonActions.has(action))
		: input