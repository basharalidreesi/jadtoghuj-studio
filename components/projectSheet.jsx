import { Button, Card, Inline } from "@sanity/ui"
import { createClient } from "@sanity/client"
import * as ReactDOM from "react-dom/client"
import { DownloadIcon } from "@sanity/icons"

const client = createClient({
	projectId: "nhelboup",
	dataset: "production",
	useCdn: true,
	apiVersion: "2022-03-21",
})

export const projectSheet = ({document}) => {
	return (<>
		<style>{`
			.jt-pS-container {
				position: relative;
				top: 0;
				left: 0;
				font-size: 16px;
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
				--jt-pS-containerWidth: 50%;
				--jt-pS-pageAspectRatio: var(--jt-pS-portraitAspectRatio);
				--jt-pS-portraitAspectRatio: 141.4%;
				--jt-pS-landscapeAspectRatio: 70.7%;
				--jt-pS-spacerHeight: 2rem;
				--jt-pS-textColour: #000000;
				--jt-pS-backgroundTopColour: #ffffff;
				--jt-pS-backgroundBottomColour: #91a3b0;
			}
			.jt-pS-container {
				width: var(--jt-pS-containerWidth);
				max-width: calc(100% - (2 * var(--jt-pS-spacerHeight)));
				min-width: 10%;
				margin-inline: auto;
			}
			.jt-pS-page {
				position: relative;
				width: 100%;
				padding-top: var(--jt-pS-pageAspectRatio);
				box-shadow: 0 0 5px 1px #ccc;
				background: linear-gradient(to bottom, var(--jt-pS-backgroundTopColour) 10%, var(--jt-pS-backgroundBottomColour) 100%);
				background-repeat: no-repeat;
			}
			.jt-pS-page:first-child {
				margin-block-start: var(--jt-pS-spacerHeight);
			}
			.jt-pS-pageBreak {
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
		`}</style>
		<div className="jt-pS-wrapper">
			<Card paddingX={2} paddingY={3} borderBottom={1} style={{ position: "sticky", top: "0", zIndex: "10", textAlign: "right" }}>
				<Inline space={2}>
					<Button id="jt-pS-generateButton" mode="ghost" text="Generate" onClick={() => generateProjectSheet(document)} />
					<Button id="jt-pS-downloadButton" icon={DownloadIcon} tone="primary" text="Download" disabled="true" />
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

async function fetchSanityData(sanityDocument) {
	const query = `
		*[_id == $id][0]{title}
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
		<div className="jt-pS-pageBreak"></div>
		<div className="jt-pS-page">
			<div className="jt-pS-pageContents"></div>
		</div>
		<div className="jt-pS-pageBreak"></div>
		<div className="jt-pS-page">
			<div className="jt-pS-pageContents"></div>
		</div>
		<div className="jt-pS-pageBreak"></div>
		<div className="jt-pS-page">
			<div className="jt-pS-pageContents"></div>
		</div>
		<div className="jt-pS-pageBreak"></div>
		<div className="jt-pS-page">
			<div className="jt-pS-pageContents"></div>
		</div>
		<div className="jt-pS-pageBreak"></div>
	</>
	const container = document.getElementById("jt-pS-container")
	const root = ReactDOM.createRoot(container)
	document.getElementById("jt-pS-generateButton").setAttribute("data-disabled", "true")
	document.getElementById("jt-pS-generateButton").style.pointerEvents = "none"
	document.getElementById("jt-pS-downloadButton").removeAttribute("disabled")
	document.getElementById("jt-pS-downloadButton").setAttribute("data-disabled", "false")
	root.render(sheet)
}