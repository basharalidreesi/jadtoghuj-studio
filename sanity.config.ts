import "./styles.css";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { singletonActions, singletonTypes, structure } from "./structure";
import { media } from "sanity-plugin-media";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { PROJECT_ICON } from "./schemaTypes/project";

export default defineConfig({
	name: "default",
	title: "Jad Toghuj",
	projectId: "i55r3kex",
	dataset: "production",
	icon: PROJECT_ICON,
	plugins: [
		structureTool({
			structure: structure,
		}),
		media(),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		templates: (prev) => prev.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
	},
	document: {
		actions: (prev, context) => singletonTypes.has(context.schemaType) ? prev.filter(({ action }) => action && singletonActions.has(action)) : prev,
	},
});