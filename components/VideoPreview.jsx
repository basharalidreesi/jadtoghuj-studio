import { useEffect, useState } from "react"
import { Card, Flex, Spinner } from "@sanity/ui"
import { ErrorOutlineIcon } from "@sanity/icons"

// DONE

export default function VideoPreview(props) {
	const [data, setData] = useState("")
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	useEffect(() => {
		async function getData() {
			const url = props.url
			var query = null
			var data = null
			var uri = null
			var hostname = null
			if (url) {
				uri = encodeURIComponent(url)
				hostname = new URL(url)?.hostname?.replace("www.", "")
			}
			if (hostname === "youtube.com" || hostname === "youtu.be") {
				query = `https://youtube.com/oembed?url=${uri}&format=json`
			}
			if (hostname === "vimeo.com") {
				query = `https://vimeo.com/api/oembed.json?url=${uri}`
			}
			if (query) {
				try {
					setIsFetching(true)
					setHasError(false)
					data = await fetch(query)?.then(async response => await response?.json())
					setData(data)
					setIsFetching(false)
				} catch {
					setIsFetching(false)
					setHasError(true)
				}
			}
			if (!query) {
				setHasError(true)
			}
		}
		getData()
	}, [props.url])
	if (!data || !props.url) { return (props.withDefault || props.renderDefault) ? props.renderDefault(props) : "" }
	if (isFetching || hasError) {
		if (props.target === "img") {
			return (
				<>
					{isFetching ? <Spinner muted style={{ marginTop: "-0.3125rem" }} /> : ""}
					{hasError ? <ErrorOutlineIcon /> : ""}
				</>
			)
		}
		if (props.target === "iframe") {
			return (
				<>
					{(props.withDefault && props.renderDefault) ? props.renderDefault(props) : ""}
					<Card marginTop={4} border={true} radius={1} tone={"transparent"} style={{ position: "relative" }}>
						<Flex style={{ width: "100%", paddingTop: "56.25%" }}>
							{isFetching ? <Spinner muted style={{ position: "absolute", top: "50%", left: "50%", marginTop: "0.275rem", transform: "translate(-50%, -50%)" }} /> : ""}
							{hasError ? <ErrorOutlineIcon style={{ position: "absolute", top: "50%", left: "50%", width: "2rem", height: "2rem", transform: "translate(-50%, -50%)" }} /> : ""}
						</Flex>
					</Card>
				</>
			)
		}
	}
	if (!isFetching && !hasError) {
		if (props.target === "img") {
			return (
				<img src={data["thumbnail_url"]} style={{ objectFit: "cover", height: "150%", marginTop: "-25%" }} />
			)
		}
		if (props.target === "iframe") {
			return (
				<>
					{(props.withDefault && props.renderDefault) ? props.renderDefault(props) : ""}
					<Card marginTop={4} border={true} radius={1} tone={"transparent"} style={{ position: "relative" }}>
						<style>{`
							.jt-iframe-wrapper > iframe {
								display: block;
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
							}
						`}</style>
						<div className={"jt-iframe-wrapper"} dangerouslySetInnerHTML={{ __html: data["html"] }} style={{ width: "100%", paddingTop: "56.25%" }}></div>
					</Card>
				</>
			)
		}
	}
}