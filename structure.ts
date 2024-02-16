import { PROJECT_ICON } from "./schemaTypes/project";
import { PRESS_ICON } from "./schemaTypes/press";
import { StructureBuilder } from "sanity/structure";
import { HOMEPAGE_ID } from "./schemaTypes/listing";

const hiddenTypes = new Set([
	"listing",
	"press",
	"project",
	"settings",
	"media.tag",
]);

const hiddenSortItems = new Set([
	"Sort by Created",
	"Sort by Last edited",
]);

export const singletonTypes = new Set([
	"listing",
	"settings",
	"media.tag",
]);

export const singletonActions = new Set([
	"publish",
	"discardChanges",
	"restore",
]);

export const structure = (S: StructureBuilder) => {
	return S.list()
		.title("Content")
		.items([
			S.divider(),
			S.listItem()
				.title("Projects")
				.icon(PROJECT_ICON)
				.child(
					S.documentTypeList("project")
						.title("Projects")
						/** @ts-ignore */
						.menuItems(S.documentTypeList("project").getMenuItems()?.filter((menuItem) => !hiddenSortItems.has(menuItem.spec.title)))
						.defaultOrdering([{ field: "year", direction: "desc" }, { field: "title", direction: "asc" }])
				),
			S.listItem()
				.title("Press")
				.icon(PRESS_ICON)
				.child(
					S.documentTypeList("press")
						.title("Press")
						/** @ts-ignore */
						.menuItems(S.documentTypeList("press").getMenuItems()?.filter((menuItem) => !hiddenSortItems.has(menuItem.spec.title)))
						.defaultOrdering([{ field: "date", direction: "desc" }, { field: "publisher", direction: "asc" }, { field: "title", direction: "asc" }])
				),
			S.divider(),
			S.documentListItem().schemaType("listing").id(HOMEPAGE_ID),
			S.documentListItem().title("Settings").schemaType("settings").id("settings"),
			S.divider(),
			/** @ts-ignore */
			...S.documentTypeListItems().filter((type) => !hiddenTypes.has(type?.spec?.id)),
		]);
};