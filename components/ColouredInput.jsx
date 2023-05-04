import { Box, Card, Flex } from "@sanity/ui"

// TODO

export default function ColouredInput(props) {
	return (
		<Flex direction="row" wrap="nowrap" gap={1}>
			<Card sizing="border" flex={1} border="true" style={{ borderRadius: "0.0625rem", background: "transparent", }}>
				<label htmlFor={props.id} style={{ display: "block", width: "100%", height: "100%", background: props?.value, }}></label>
			</Card>
			<Box flex={3}>
				{props.renderDefault(props)}
			</Box>
		</Flex>
	)
}