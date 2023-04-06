import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { structure } from "./structure"
import { defaultDocumentNode } from "./defaultDocumentNode"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { templates } from "./templatesAndActions"
import { newDocumentOptions } from "./newDocumentOptions"
import { actions } from "./templatesAndActions"
import { logo } from "./components/logo"
import { hideElementUsingCssSelector } from "./components/css"
import { colorInput } from "@sanity/color-input"

export default defineConfig({
	name: "default",
	title: "Jad Toghuj",
	projectId: "nhelboup",
	dataset: "production",
	plugins: [
		deskTool({
			title: "Library",
			structure,
			defaultDocumentNode,
		}),
		visionTool(),
		colorInput(),
	],
	schema: {
		types: schemaTypes,
		templates: templates,
	},
	document: {
		newDocumentOptions: newDocumentOptions,
		actions: actions,
	},
	studio: {
		components: {
			logo: logo,
			layout: (props) => hideElementUsingCssSelector(props, '[id^="noCreate-"] [data-ui="Button"][data-testid="action-intent-button"]'),
		},
	},
})
