import { useCallback, useEffect, useState } from "react"
import { useFormValue } from "sanity"
import client from "../sanity.client"
import { Box, Card, Flex, Spinner, Text } from "@sanity/ui"
import { ErrorOutlineIcon } from "@sanity/icons"

export default function InputWithPrefixOrSuffix(props) {
	const prefix = {
		hasPrefix: props.prefix ? true : false,
		prefixFromDocument: props.prefix?.fromDocument || null,
		prefixFromFields: props.prefix?.fromFields || null,
		prefixFromString: props.prefix?.fromString || null,
		resolvedPrefix: null,
	}
	const suffix = {
		hasSuffix: props.suffix ? true : false,
		suffixFromDocument: props.suffix?.fromDocument || null,
		suffixFromFields: props.suffix?.fromFields || null,
		suffixFromString: props.suffix?.fromString || null,
		resolvedSuffix: null,
	}
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [fetchedPrefix, setFetchedPrefix] = useState(null)
	const [fetchedSuffix, setFetchedSuffix] = useState(null)
	var localPrefix = null
	var localSuffix = null
	var staticPrefix = null
	var staticSuffix = null
	const fetchValues = useCallback(async (document, fields) => {
		if (!document || !fields) { return null }
		const query = `*[_id == "${document}"][0] { ${fields.join(", ")} }`
		try {
			setHasError(false)
			setIsFetching(true)
			const data = await client.fetch(query)
			setIsFetching(false)
			return fields.map(field => data[`${field}`]).join("")
		} catch {
			setIsFetching(false)
			setHasError(true)
		}
	}, [])
	if (prefix.hasPrefix && prefix.prefixFromDocument && prefix.prefixFromFields && !prefix.prefixFromString) {
		useEffect(() => {
			const getValues = async () => {
				const values = await fetchValues(prefix.prefixFromDocument, prefix.prefixFromFields) || null
				setFetchedPrefix(values)
			}
			getValues()
		}, [])
	}
	if (suffix.hasSuffix && suffix.suffixFromDocument && suffix.suffixFromFields && !suffix.suffixFromString) {
		useEffect(() => {
			const getValues = async () => {
				const values = await fetchValues(suffix.suffixFromDocument, suffix.suffixFromFields) || null
				setFetchedSuffix(values)
			}
			getValues()
		}, [])
	}
	if (prefix.hasPrefix && !prefix.prefixFromDocument && prefix.prefixFromFields && !prefix.prefixFromString) {
		localPrefix = prefix.prefixFromFields.map(field => useFormValue([`${field}`]))?.join("")
	}
	if (suffix.hasSuffix && !suffix.suffixFromDocument && suffix.suffixFromFields && !suffix.suffixFromString) {
		localSuffix = suffix.suffixFromFields.map(field => useFormValue([`${field}`]))?.join("")
	}
	if (prefix.hasPrefix && prefix.prefixFromString) {
		staticPrefix = prefix.prefixFromString
	}
	if (suffix.hasSuffix && suffix.suffixFromString) {
		staticSuffix = suffix.suffixFromString
	}
	prefix.resolvedPrefix = staticPrefix || localPrefix || fetchedPrefix
	suffix.resolvedSuffix = staticSuffix || localSuffix || fetchedSuffix
	const Extension = (props) => {
		if (!props.text && !isFetching && !hasError) { return null }
		return (
			<Card sizing={"border"} padding={2} radius={1} border={true} tone={!isFetching && !hasError ? "positive" : "critical"} style={{ display: "flex", alignItems: "center", maxWidth: "25%", minHeight: "2.1875rem" }}>
				{isFetching
					? <Spinner muted />
					: ""
				}
				{hasError
					? <ErrorOutlineIcon style={{ display: "block", width: "100%", height: "100%", color: "var(--card-fg-color)" }} />
					: ""
				}
				{(!isFetching && !hasError)
					? (
						<Text size={0} muted={true} style={{ maxWidth: "100%" }}>
							<div dir={props.type === "prefix" ? "rtl" : null} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
								<bdi>{props.text}</bdi>
							</div>
						</Text>
					)
					: ""
				}
			</Card>
		)
	}
	return (prefix.resolvedPrefix || suffix.resolvedSuffix)
		? (
			<Flex direction="row" wrap="nowrap" justify="center" gap={1}>
				<Extension text={prefix.resolvedPrefix} type={"prefix"} />
				<Box flex={1}>
					{props.renderDefault(props)}
				</Box>
				<Extension text={suffix.resolvedSuffix} type={"suffix"} />
			</Flex>
		)
		: props.renderDefault(props)
}