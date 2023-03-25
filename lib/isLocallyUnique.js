import { apiVersion } from "../sanity.client"

export async function isLocallyUnique(address, context) {
	const { document, getClient } = context
	const client = getClient({apiVersion})
	const id = document._id.replace(/^drafts\./, "")
	const query = `!defined(*[!(_id in [$draft, $published]) && address.current == $address && website == $website && _type == $type][0]._id)`
	const params = {
		draft: `drafts.${id}`,
		published: id,
		type: document._type,
		website: document.website,
		address,
	}
	const result = await client.fetch(query, params)
	return result
}