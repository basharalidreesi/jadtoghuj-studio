import { Box, Card, Flex } from "@sanity/ui"

export default function ColourPreview(props) {
	const withDefault = props.options?.withDefault && props.renderDefault
	const Preview = () => (
		<Card
			as={(withDefault || props.id || props.options?.inputId) ? "label" : "div"}
			htmlFor={(withDefault || props.options?.inputId || props.id) ? props.options?.inputId || props.id : null}
			sizing={"border"}
			flex={1}
			border={"true"}
			style={{
				display: "block",
				width: "100%",
				height: "100%",
				minHeight: "2.1875rem",
				borderRadius: "0.0625rem",
				background: `white linear-gradient(to bottom, ${props.options?.colour}, ${props.options?.colour})` || "transparent",
				borderRight: 0,
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
			}}
		></Card>
	)
	return withDefault
		? (
			<Flex className="jt-colour-preview-wrapper" direction={"row"} wrap={"nowrap"}>
				<style>{`
					.jt-colour-preview-wrapper input + span {
						border-top-left-radius: 0;
						border-bottom-left-radius: 0;
					}
				`}</style>
				<Preview />
				<Box flex={3}>
					{props.renderDefault({...props, elementProps: { ...props.elementProps, placeholder: props.options?.placeholder }})}
				</Box>
			</Flex>
		)
		: <Preview />
}