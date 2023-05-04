import client from "../sanity.client"
import { useFormValue } from "sanity"
import { useEffect, useState } from "react"
import { Box, Card, Flex, Spinner, Text } from "@sanity/ui"
import { ErrorOutlineIcon } from "@sanity/icons"

export default function PrefixedInput(props) {
	var localPrefix = null
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [fetchedPrefix, setFetchedPrefix] = useState([])
	const source = props.source || null
	const prefix = props.prefix || null
	const suffix = props.suffix || null
	if (source && prefix && Array.isArray(prefix)) {
		useEffect(() => {
			setIsFetching(true)
			async function getPrefix() {
				const query = `*[_id == "${source}"][0] { ${prefix?.join(", ")} }`
				try {
					setIsFetching(true)
					setHasError(false)
					const data = await client.fetch(query)
					const values = prefix.map(field => data[`${field}`]).join("")
					setFetchedPrefix(values)
				} catch {
					setIsFetching(false)
					setHasError(true)
				}
				setIsFetching(false)
			}
			getPrefix()
		}, [source])
	}
	if (!source && prefix && Array.isArray(prefix)) {
		localPrefix = prefix?.map(field => useFormValue([`${field}`]))?.join("")
	}
	if (!source && prefix && !Array.isArray(prefix)) {
		localPrefix = prefix
	}
	const extension = (text, marginLeft, marginRight) => (
		<Card sizing={"border"} padding={2} marginLeft={marginLeft} marginRight={marginRight} radius={1} border={true} tone={!isFetching && !hasError ? "positive" : "critical"} style={{ display: "flex", alignItems: "center", maxWidth: "30%" }}>
			{isFetching ? <Spinner muted /> : ""}
			{hasError ? <ErrorOutlineIcon style={{ display: "block", width: "100%", height: "100%", color: "var(--card-fg-color)" }} /> : ""}
			{!isFetching && !hasError
				? (
					<Text size={0} muted={true} style={{ maxWidth: "100%" }}>
						<div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
							{text}
						</div>
					</Text>
				)
				: ""
			}
		</Card>
	)
	return ((localPrefix || fetchedPrefix || suffix) && props.value?.current !== "/" && props.value !== "/")
		? (<>
				<Flex direction="row" wrap="nowrap" justify="center">
					{(localPrefix || fetchedPrefix) ? extension(localPrefix || fetchedPrefix, 0, 1) : ""}
					<Box flex={1}>
						{props.renderDefault(props)}
					</Box>
					{suffix ? extension(suffix, 1, 0) : ""}
				</Flex>
			</>)
		: props.renderDefault(props)
}