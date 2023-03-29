export function previewArrayValues(value0, value1, value2, value3, { separator = ", ", prefix, begin = ": ", end = "" } = {}) {
	const values = [value0, value1, value2]?.filter(Boolean)?.join(separator) || ""
	return value3 ? (prefix ? (prefix + (values ? begin : "") + values + separator + "..." + (values ? end : "")) : (values + separator + "...")) : (prefix ? (prefix + (values ? begin : "") + values + (values ? end : "")) : values)
}