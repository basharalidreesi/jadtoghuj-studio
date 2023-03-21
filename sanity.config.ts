import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { templates } from "./templatesAndActions"
import { actions } from "./templatesAndActions"
import { structure } from "./structure"
import { defaultDocumentNode } from "./defaultDocumentNode"
import { logo } from "./components/logo"
import { hideElementUsingCssSelector } from "./components/css"

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
		templates: templates,
	},
	document: {
		actions: actions,
	},
	studio: {
		components: {
			logo: logo,
			layout: (props) => hideElementUsingCssSelector(props, '[id^="noCreate-"] [data-ui="Button"][data-testid="action-intent-button"]'),
			navbar: (props) => hideElementUsingCssSelector(props, `
				#new-document-dialog [data-ui="Button"][href="/intent/create/template=look;type=look/"],
				#new-document-dialog [data-ui="Button"][href="/intent/create/template=page;type=page/"],
				#new-document-dialog [data-ui="Button"][href="/intent/create/template=settings;type=settings/"],
				#new-document-dialog [data-ui="Button"][href="/intent/create/template=settings-for-jadtoghuj.com;type=settings/"]
			`),
		},
	},
})
