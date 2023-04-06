import { Card } from "@sanity/ui"

export const gradientPreview = (props) => {
	return (
		<>
			{props.renderDefault(props)}
			<Card border="true" style={{ position: "relative", width: "100%", paddingTop: "25%", background: `linear-gradient(to bottom, ${props.value.topColour.hex} 10%, ${props.value.bottomColour.hex})`, }}>
				<div align="center" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: props.value.textColour.hex }}>
					<p>
						Preview
					</p>
				</div>
			</Card>
		</>
	)
}