import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { structure } from "./structure"
import { defaultDocumentNode } from "./defaultDocumentNode"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { actions, newDocumentOptions } from "./document"
import { Logo } from "./components"

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
	],
	schema: {
		types: schemaTypes,
	},
	document: {
		newDocumentOptions: newDocumentOptions,
		actions: actions,
	},
	studio: {
		components: {
			logo: Logo,
		},
	},
})
