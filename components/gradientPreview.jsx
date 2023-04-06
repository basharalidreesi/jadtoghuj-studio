import { Card } from "@sanity/ui"

export const gradientPreview = (props) => {
	return (
		<>
			{props.renderDefault(props)}
			<Card border="true" sizing="border" style={{ position: "relative", width: "100%", paddingTop: "33%", borderRadius: "0.0625rem", background: `linear-gradient(to bottom, ${props?.value?.topColour}, ${props?.value?.bottomColour})`, }}>
				<div align="center" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: props?.value?.textColour, }}>
					<p>
						Preview
					</p>
				</div>
			</Card>
		</>
	)
}