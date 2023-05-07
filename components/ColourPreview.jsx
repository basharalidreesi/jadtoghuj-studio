import { Box, Card, Flex } from "@sanity/ui"

export default function ColourPreview(props) {
	const withDefault = props.options?.withDefault && props.renderDefault
	const Preview = () => (
		<Card
			as={(withDefault || props.id) ? "label" : "div"}
			htmlFor={(withDefault || props.id) ? props.id : null}
			sizing="border"
			flex={1}
			border="true"
			style={{
				display: "block",
				width: "100%",
				height: "100%",
				minHeight: "2.1875rem",
				borderRadius: "0.0625rem",
				background: props.options?.colour || "transparent",
			}}
		></Card>
	)
	return withDefault
		? (
			<Flex direction="row" wrap="nowrap" gap={1}>
				<Preview />
				<Box flex={3}>
					{props.renderDefault({...props, elementProps: { ...props.elementProps, placeholder: props.schemaType?.initialValue }})}
				</Box>
			</Flex>
		)
		: <Preview />
}