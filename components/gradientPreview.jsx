import { Card } from "@sanity/ui"

export const gradientPreview = (props) => {
	const c1 = props.schemaType.options?.colour1 ? props.value[props.schemaType.options?.colour1] : "#000000"
	const c2 = props.schemaType.options?.colour2 ? props.value[props.schemaType.options?.colour2] : "#ffffff"
	const c3 = props.schemaType.options?.colour3 ? props.value[props.schemaType.options?.colour3] : "#ffffff"
	return (
		<>
			{props.renderDefault(props)}
			<Card sizing="border" border="true" style={{ position: "relative", width: "100%", paddingTop: "33%", borderRadius: "0.0625rem", background: `linear-gradient(to bottom, ${c2}, ${c3})`, }}>
				<div align="center" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: c1, }}>
					<p>
						Preview
					</p>
				</div>
			</Card>
		</>
	)
}