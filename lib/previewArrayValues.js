// DONE

export default function previewArrayValues(
	value0,
	value1,
	value2,
	value3, {
		ref0,
		ref1,
		ref2,
		ref3,
		prefix,
		separator = ", ",
		prepend = ": ",
		append = "",
		untitledLabel = "Untitled",
	} = {}) {
	const values = [(value0 ? value0 : (ref0 ? untitledLabel : "")), (value1 ? value1 : (ref1 ? untitledLabel : "")), (value2 ? value2 : (ref2 ? untitledLabel : ""))]?.filter(Boolean)?.join(separator) || ""
	return (value3 || ref3) ? (prefix ? (prefix + (values ? prepend : "") + values + separator + "..." + (values ? append : "")) : (values + separator + "...")) : (prefix ? (prefix + (values ? prepend : "") + values + (values ? append : "")) : values)
}