import { Box, Card, Flex } from "@sanity/ui"

export const colourPreview = (props) => {
	return (
		<Flex direction="row" wrap="nowrap">
			<Card border="true" sizing="border" flex={1} marginRight={3} tone="transparent" style={{ borderRadius: "0.0625rem", }}>
				<label for={props.id} style={{ display: "block", width: "100%", height: "100%", background: props?.value, }}></label>
			</Card>
			<Box flex={3}>
				{props.renderDefault(props)}
			</Box>
		</Flex>
	)
}