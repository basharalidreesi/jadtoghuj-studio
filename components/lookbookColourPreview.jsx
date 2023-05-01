import { Box, Card, Flex, Text, TextInput } from "@sanity/ui"
import { client } from "../sanity.client"
import { useEffect, useState } from "react"
import { useFormValue } from "sanity"

export const lookbookColourPreview = (props) => {
	const lookbook = useFormValue(["lookbook"])
	const image0 = lookbook && lookbook[0]._type === "image" && lookbook[0].asset ? lookbook[0] : null
	const ref = image0 ? image0.asset._ref : "null"
	const [colour, setColour] = useState(0)
	useEffect(() => {
		async function getDefaultBackgroundColour() {
			const defaultBackgroundColour = await client.fetch(`*[_type == "settings" && website == "jadtoghuj.com"].colours.bottom`)
			setColour(defaultBackgroundColour)
		}
		async function getDominantBackgroundColour() {
			const dominantBackgroundColour = await client.fetch(`*[_id == "${ref}"].metadata.palette.dominant.background`)
			setColour(dominantBackgroundColour)
		}
		if (image0) {
			getDominantBackgroundColour()
		} else {
			getDefaultBackgroundColour()
		}
	}, [ref])
	return useFormValue(["useCustomColour"]) === true
		? props.renderDefault(props)
		: (
			<>
				{props.renderDefault(props)}
				<Box>
					<Box paddingTop={2} paddingBottom={3}>
						<Text size={1} weight="semibold">
							<label htmlFor="lookbook-colour-preview">
								Colour
							</label>
						</Text>
					</Box>
					<Flex direction="row" wrap="nowrap">
						<Card sizing="border" flex={1} marginRight={2} border="true" style={{ borderRadius: "0.0625rem", background: "transparent", }}>
							<label htmlFor="lookbook-colour-preview" style={{ display: "block", width: "100%", height: "100%", background: colour }}></label>
						</Card>
						<Box flex={3}>
							<TextInput value={colour} id="lookbook-colour-preview" readOnly />
						</Box>
					</Flex>
				</Box>
			</>
		)
}