import { HotspotTooltipProps } from "sanity-plugin-hotspot-array";
import { Box, Text } from "@sanity/ui";
import { portableTextToPlainText } from "../utils/portableTextUtils";

export const HotspotPreview = (props: HotspotTooltipProps & { value: any; }) => {
	const details = props.value?.details;
	return (
		<Box padding={2} style={{ minWidth: details && 200 || "unset", maxWidth: 400, }}>
			<Text textOverflow={"ellipsis"} muted={details ? false : true} size={1} style={{ minHeight: "0.375lh", }}>
				{details && portableTextToPlainText(details) || "Untitled"}
			</Text>
		</Box>
	);
};