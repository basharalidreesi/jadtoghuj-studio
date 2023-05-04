import { EditIcon } from "@sanity/icons"

export const defaultDocumentNode = (S, {schemaType}) => {
	if (schemaType === "project") {
		return S.document().views([
			S.view.form().icon(EditIcon),
		])
	}
	return S.document().views([
		S.view.form().icon(EditIcon),
	])
}