export function previewArrayValues(value0, value1, value2, value3, {
	separator = ", ",
	prefix,
	begin = ": ",
	end = "",
	ref0,
	ref1,
	ref2,
	ref3,
	untitled = "Untitled",
} = {}) {
	const values = [(value0 ? value0 : (ref0 ? untitled : "")), (value1 ? value1 : (ref1 ? untitled : "")), (value2 ? value2 : (ref2 ? untitled : ""))]?.filter(Boolean)?.join(separator) || ""
	return (value3 || ref3) ? (prefix ? (prefix + (values ? begin : "") + values + separator + "..." + (values ? end : "")) : (values + separator + "...")) : (prefix ? (prefix + (values ? begin : "") + values + (values ? end : "")) : values)
}