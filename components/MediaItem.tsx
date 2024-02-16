import { Image, ImageMetadata, ImageValue, ItemProps } from "sanity";
import { referenceConfig, stringConfig } from "../util";
import { Box, Card, Flex } from "@sanity/ui";

export default function MediaItem(props: ItemProps & { value: ImageValue }) {
	const {
		renderDefault,
		value,
	} = props;
	var backgroundColor = stringConfig.DEFAULT_BACKGROUND_COLOR;
	if (value._type === "image" && value.asset && value.asset._ref) {
		/** @ts-ignore */
		const image = referenceConfig.buildReference(value.asset?._ref, [value]) as Image & { metadata: ImageMetadata; };
		backgroundColor = image?.metadata?.palette?.dominant?.background as string;
	};
	return (
		<Flex paddingRight={2} align="center" style={{ gap: "0.75rem", paddingInlineEnd: "1.125em" }}>
			<Box flex={1}>{renderDefault(props)}</Box>
			<Card shadow={2} radius={1} style={{ backgroundColor: backgroundColor, width: "1em", height: "1em", }}></Card>
		</Flex>
	);
};