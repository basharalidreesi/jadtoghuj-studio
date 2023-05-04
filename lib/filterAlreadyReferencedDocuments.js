export default function filterAlreadyReferencedDocuments(context) {
	const referencedDocuments = context?.map(doc => doc?._ref?.replace(/^drafts\./, ""))?.filter(Boolean) || ""
	const drafts = referencedDocuments?.map(doc => `drafts.${doc}`)
	return {
		filter: '!(_id in $referencedDocuments) && !(_id in $drafts)',
		params: {
			referencedDocuments,
			drafts,
		}
	}
}