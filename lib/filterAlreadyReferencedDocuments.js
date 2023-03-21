export function filterAlreadyReferencedDocuments(context) {
	const referencedDocuments = context?.map(doc => doc._ref)?.filter(Boolean)
	return {
		filter: "!(_id in $referencedDocuments)",
		params: {
			referencedDocuments,
		}
	}
}