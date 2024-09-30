import { defineConfig } from "sanity";
import { JadToghujIcon } from "./components";
import { StructureBuilder, structureTool } from "sanity/structure";
import { media, mediaAssetSource } from "sanity-plugin-media";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { studioInformationIcon } from "./schemaTypes/studioInformation";
import { homePageIcon } from "./schemaTypes/homePage";
import { recommendedItemsIcons } from "./schemaTypes/recommendedItems";
import { websiteGlobalsIcon } from "./schemaTypes/websiteGlobals";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["homePage", "recommendedItems", "studioInformation", "websiteGlobals", "media.tag"]);
const singletonListItem = (S: StructureBuilder, typeName: string, title?: string) => {
	return S.listItem().title(title || typeName).id(typeName).child(S.document().schemaType(typeName).documentId(typeName));
};

export default defineConfig({
	name: "default",
	title: "Jad Toghuj",
	icon: JadToghujIcon,
	projectId: "r5iw9ewg",
	dataset: "production",
	plugins: [
		structureTool({
			structure: (S) => {
				return S.list().title("Content").items([
					S.documentTypeListItem("project").title("Projects"),
					S.documentTypeListItem("article").title("Articles"),
					S.documentTypeListItem("pressItem").title("Press"),
					S.documentTypeListItem("category").title("Categories"),
					S.divider(),
					singletonListItem(S, "studioInformation", "Studio").icon(studioInformationIcon),
					singletonListItem(S, "homePage", "Home Page").icon(homePageIcon),
					singletonListItem(S, "recommendedItems", "Recommended Items").icon(recommendedItemsIcons),
					singletonListItem(S, "websiteGlobals", "Website Globals").icon(websiteGlobalsIcon),
				]);
			},
		}),
		media(),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) => {
			return templates.filter(({ schemaType }) => !singletonTypes.has(schemaType));
		},
	},
	document: {
		actions: (input, context) => {
			return singletonTypes.has(context.schemaType) ? input.filter(({ action }) => action && singletonActions.has(action)) : input;
		},
	},
	form: {
		image: {
			assetSources: previousAssetSources => {
				return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource);
			},
		},
	},
});