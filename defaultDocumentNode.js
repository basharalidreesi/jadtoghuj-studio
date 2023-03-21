import { EditIcon, InfoOutlineIcon } from "@sanity/icons"
import { projectSheet } from "./components/projectSheet"

export const defaultDocumentNode = (S, {schemaType}) => {
	if (schemaType === "project") {
		return S.document().views([
			S.view.form().icon(EditIcon),
			// S.view.component(projectSheet).title("Project Sheet").icon(InfoOutlineIcon),
		])
	}
	return S.document().views([
		S.view.form().icon(EditIcon),
	])
}