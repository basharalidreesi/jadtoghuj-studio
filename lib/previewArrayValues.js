export function previewArrayValues(value0, value1, value2, value3, { separator = ", ", prefix } = {}) {
	const values = [value0, value1, value2]?.filter(Boolean)?.join(separator) || ""
	return value3 ? (prefix ? (prefix + ": " + values + separator + "...") : (values + separator + "...")) : (prefix ? (prefix + ": " + values) : values)
}