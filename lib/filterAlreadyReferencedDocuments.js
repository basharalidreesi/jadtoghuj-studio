export default function filterAlreadyReferencedDocuments(context) {
	const referencedDocuments = context?.map((document) => document?._ref?.replace(/^drafts\./, ""))?.filter(Boolean) || ""
	const drafts = referencedDocuments?.map((document) => `drafts.${document}`)
	return {
		filter: `!(_id in $referencedDocuments) && !(_id in $drafts)`,
		params: {
			referencedDocuments,
			drafts,
		}
	}
}