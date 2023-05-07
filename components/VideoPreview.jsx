import { useEffect, useState } from "react"
import { Card, Flex, Spinner } from "@sanity/ui"
import { ErrorOutlineIcon } from "@sanity/icons"

export default function VideoPreview(props) {
	const [data, setData] = useState("")
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	const videoUrl = props.options?.from || null
	const asImg = props.options?.as === "img" || false
	const asIframe = props.options?.as === "iframe" || false
	const withDefault = props.options?.withDefault || false
	const hasRenderDefault = props.renderDefault ? true : false
	useEffect(() => {
		async function getData() {
			try {
				var query = null
				const url = videoUrl
				const uri = encodeURIComponent(url)
				const hostname = new URL(url)?.hostname?.replace("www.", "")
				if (hostname === "youtube.com" || hostname === "youtu.be") {
					query = `https://youtube.com/oembed?url=${uri}&format=json`
				}
				if (hostname === "vimeo.com") {
					query = `https://vimeo.com/api/oembed.json?url=${uri}`
				}
				if (query) {
					setIsFetching(true)
					setHasError(false)
					const data = await fetch(query)?.then(async (response) => await response?.json()).then(console.info("Fetching video."))
					setData(data)
					setIsFetching(false)
				}
			} catch {
				setIsFetching(false)
				setHasError(true)
			}
		}
		getData()
	}, [videoUrl])
	const asIframeCardProps = {
		marginTop: 4,
		border: true,
		radius: 1,
		style: { position: "relative" },
	}
	if (!data || !videoUrl) {
		if (asImg) {
			return <ErrorOutlineIcon />
		}
		if (asIframe && (withDefault || hasRenderDefault)) {
			return props.renderDefault(props)
		}
	}
	if (isFetching || hasError) {
		if (asImg) {
			if (isFetching) {
				return <Spinner muted style={{ marginTop: "-0.3125rem" }} />
			}
			if (hasError) {
				return <ErrorOutlineIcon />
			}
		}
		if (asIframe) {
			return (
				<>
					{withDefault && hasRenderDefault ? props.renderDefault(props) : ""}
					<Card {...asIframeCardProps} tone={hasError ? "critical" : "transparent"}>
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
		if (asImg) {
			return <img src={data["thumbnail_url"]} style={{ objectFit: "cover", height: "150%", marginTop: "-25%" }} />
		}
		if (asIframe) {
			return (
				<>
					{withDefault && hasRenderDefault ? props.renderDefault(props) : ""}
					<Card {...asIframeCardProps} tone={"transparent"}>
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