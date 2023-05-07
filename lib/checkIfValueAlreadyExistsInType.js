import { apiVersion } from "../sanity.client"

export default async function checkIfValueAlreadyExistsInType(value, context) {
	if (!value) { return true }
	const { document, getClient, path } = context
	const type = document._type
	const id = document._id.replace(/^drafts\./, "")
	const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && lower(${path.join(".")}) == $value][0]._id)`
	const params = {
		type: type,
		draft: `drafts.${id}`,
		published: id,
		value: value.toLowerCase(),
	}
	const isUnique = await getClient({apiVersion}).fetch(query, params).then(console.info("Fetching to check uniqueness."))
	if (!isUnique) {
		return `A${/[aeiouAEIOU]/.test(type[0]) ? "n" : ""} ${type} with this ${path[path.length - 1]} already exists.`
	}
	return true
}