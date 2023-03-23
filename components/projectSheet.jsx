import { Button, Card, Inline } from "@sanity/ui"
import { createClient } from "@sanity/client"
import * as ReactDOM from "react-dom/client"
import { DownloadIcon } from "@sanity/icons"
import React, { useEffect } from "react"

const client = createClient({
	projectId: "nhelboup",
	dataset: "production",
	useCdn: true,
	apiVersion: "2022-03-21",
})

const context = document

export const projectSheet = ({document}) => {
	useEffect(() => {
		switchButtonState(context.getElementById("jt-pS-downloadButton"))
	}, [])
	return (<>
		<style>{`
			.jt-pS-wrapper {
				position: relative;
				top: 0;
				left: 0;
			}
			.jt-pS-container {
				font-size: calc(var(--jt-pS-pageWidth) / 37.207654146);
				font-weight: 400;
				font-style: normal;
				line-height: 1.0;
			}
			.jt-pS-container *,
			.jt-pS-container *::before,
			.jt-pS-container *::after {
				margin: 0;
				padding: 0;
				font-size: inherit;
				font-family: inherit;
				font-weight: inherit;
				font-style: inherit;
				line-height: inherit;
				color: var(--jt-pS-textColour);
				font-synthesis: none;
				text-align: inherit;
				text-decoration: inherit;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				-webkit-text-size-adjust: none; // TODO
				-moz-text-size-adjust: none; // TODO
				-ms-text-size-adjust: none; // TODO
				text-size-adjust: none; // TODO
				text-rendering: geometricPrecision; // TODO
				-webkit-font-smoothing: antialiased; // TODO
				word-break: break-word; // TODO
				touch-action: manipulation;
			}
			.jt-pS-container {
				--jt-pS-pageWidth: 100vw;
				--jt-pS-containerWidth: 50%;
				--jt-pS-pageAspectRatio: 141.27%;
				--jt-pS-spacerHeight: 2rem;
				--jt-pS-textColour: #000000;
				--jt-pS-backgroundTopColour: #ffffff;
				--jt-pS-backgroundBottomColour: #91a3b0;
			}
			.jt-pS-container {
				width: var(--jt-pS-containerWidth);
				max-width: calc(100% - (2 * var(--jt-pS-spacerHeight)));
				margin-inline: auto;
			}
			.jt-pS-page {
				position: relative;
				width: 100%;
				padding-top: var(--jt-pS-pageAspectRatio);
				// box-shadow: 0 0 5px 1px #ccc;
				background: linear-gradient(to bottom, var(--jt-pS-backgroundTopColour) 10%, var(--jt-pS-backgroundBottomColour) 100%);
				background-repeat: no-repeat;
			}
			.jt-pS-page:first-child {
				margin-block-start: var(--jt-pS-spacerHeight);
			}
			.jt-pS-spacer {
				width: 100%;
				height: var(--jt-pS-spacerHeight);
			}
			.jt-pS-pageContents {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			@page {
				margin: 0 !important;
			}
			@media print {
				html, body {
					margin: 0 !important;
				}
				.jt-pS-spacer {
					display: none;
				}
			}
		`}</style>
		<div className="jt-pS-wrapper">
			<Card paddingX={3} paddingY={2} borderBottom={1} style={{ position: "sticky", top: "0", zIndex: "10", textAlign: "right" }}>
				<Inline space={2}>
					<Button id="jt-pS-generateButton" mode="ghost" text="Generate" onClick={() => generateProjectSheet(document)} />
					<Button id="jt-pS-downloadButton" icon={DownloadIcon} tone="primary" text="Download" onClick={() => downloadProjectSheet()} />
				</Inline>
			</Card>
			<div className="jt-pS-container" id="jt-pS-container"></div>
		</div>
	</>)
}

const generateProjectSheet = (sanityDocument) => {
	fetchSanityData(sanityDocument).then(
		data => renderProjectSheet(data)
	)
}

const switchButtonState = (target) => {
	if (target?.getAttribute("data-disabled") === "true" || target?.getAttribute("disabled") === "true") {
		target.removeAttribute("data-disabled")
		target.removeAttribute("disabled")
		target.style.removeProperty("pointer-events")
	} else {
		target.setAttribute("data-disabled", "true")
		target.setAttribute("disabled", "true")
		target.style.setProperty("pointer-events", "none")
	}
} 

const downloadProjectSheet = () => {
	console.log("hi")
	const container = document.getElementById("jt-pS-container")
	const sanity = document.getElementById("sanity")
	const clone = container.cloneNode(true)
	clone.removeAttribute("id")
	clone.style.setProperty("--jt-pS-containerWidth", "100%")
	clone.style.setProperty("--jt-pS-spacerHeight", "0")
	clone.style.setProperty("min-width", "210mm")
	sanity.style.setProperty("display", "none")
	document.body.appendChild(clone)
	window.print()
	// sanity.style.setProperty("display", "block")
	// clone.remove()
}

async function fetchSanityData(sanityDocument) {
	const query = `
		*[_id == $id][0] {
			title,
			looks[] {
				_key,
				...@->{title},
			},
			lookbook[] {
				_key,
				"asset": asset->{originalFilename},
			},
		}
	`
	const params = {
		id: sanityDocument.displayed._id,
	}
	const response = await client.fetch(query, params)
	const data = await response
	return data
}

const renderProjectSheet = (data) => {
	const sheet = <>
		<div className="jt-pS-page">
			<div className="jt-pS-pageContents">
				<h1>{data.title}</h1>
			</div>
		</div>
		<div className="jt-pS-spacer"></div>
		{data.looks.map(look => {
			return (
				<React.Fragment key={look._key}>
					<div className="jt-pS-page">
						<div className="jt-pS-pageContents">
							<h1>{look.title}</h1>
						</div>
					</div>
					<div className="jt-pS-spacer"></div>
				</React.Fragment>
			)
		})}
		{data.lookbook.map(image => {
			return (
				<React.Fragment key={image._key}>
					<div className="jt-pS-page">
						<div className="jt-pS-pageContents">
							<h1>{image.asset.originalFilename}</h1>
						</div>
					</div>
					<div className="jt-pS-spacer"></div>
				</React.Fragment>
			)
		})}
	</>
	const container = document.getElementById("jt-pS-container")
	const root = ReactDOM.createRoot(container)
	switchButtonState(document.getElementById("jt-pS-generateButton"))
	switchButtonState(document.getElementById("jt-pS-downloadButton"))
	root.render(sheet)
}