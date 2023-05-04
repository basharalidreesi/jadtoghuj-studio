import { useEffect, useState } from "react"
import { useFormValue } from "sanity"
import client from "../sanity.client"
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
	const extension = (text) => (
		<Card sizing={"border"} padding={2} radius={1} border={true} tone={!isFetching && !hasError ? "positive" : "critical"} style={{ display: "flex", alignItems: "center", maxWidth: "25%" }}>
			{isFetching ? <Spinner muted /> : ""}
			{hasError ? <ErrorOutlineIcon style={{ display: "block", width: "100%", height: "100%", color: "var(--card-fg-color)" }} /> : ""}
			{!isFetching && !hasError
				? (
					<Text size={0} muted={true} style={{ maxWidth: "100%" }}>
						<div dir={"rtl"} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
							<bdi>{text}</bdi>
						</div>
					</Text>
				)
				: ""
			}
		</Card>
	)
	return (localPrefix || fetchedPrefix || suffix)
		? (<>
				<Flex direction="row" wrap="nowrap" justify="center" gap={1}>
					{(localPrefix || fetchedPrefix) ? extension(localPrefix || fetchedPrefix) : ""}
					<Box flex={1}>
						{props.renderDefault(props)}
					</Box>
					{suffix ? extension(suffix) : ""}
				</Flex>
			</>)
		: props.renderDefault(props)
}