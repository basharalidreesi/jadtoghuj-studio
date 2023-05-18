import { Card, Flex } from "@sanity/ui"

export default function GradientPreview(props) {
	const colour1 = props.options?.colour1 || "#000000"
	const colour2 = props.options?.colour2 || "#ffffff"
	const colour3 = props.options?.colour3 || "#ffffff"
	return (
		<>
			{props.options?.withDefault && props.renderDefault ? props.renderDefault(props) : ""}
			<Card
				shadow={1}
				radius={1}
				style={{
					position: "relative",
					width: "100%",
					paddingTop: "33%",
					background: `linear-gradient(to bottom, ${colour2}, ${colour3})`,
				}}
			>
				<Flex
					align={"center"}
					justify={"center"}
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						color: colour1,
					}}
				>
					<p>
						Preview
					</p>
				</Flex>
			</Card>
		</>
	)
}