import { ImageMetadata, ImageValue, InputProps, useFormValue } from "sanity";
import { Box, Card } from "@sanity/ui";
import { referenceConfig, stringConfig } from "../util";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";

export default function MediaColorInput(props: InputProps) {
	var color = stringConfig.DEFAULT_BACKGROUND_COLOR;
	const mediaArray = useFormValue(["media"]) as { _type: "image" | "video"; asset?: ImageValue }[];
	const doesHaveCustomColor = useFormValue(["doesHaveCustomColor"]) as boolean;
	const firstMediaArrayItem = mediaArray?.[0];
	if (firstMediaArrayItem && firstMediaArrayItem._type === "image") {
		try {
			/** @ts-ignore */
			const firstMediaItemRef = firstMediaArrayItem.asset._ref as string;
			/** @ts-ignore */
			const firstMediaItemImage = referenceConfig.buildReference(firstMediaItemRef, [mediaArray, doesHaveCustomColor]) as SanityImageObject & { metadata: ImageMetadata };
			const backgroundColor = firstMediaItemImage?.metadata?.palette?.dominant?.background as string;
			color = backgroundColor;
		} catch(error) {
			console.error(error);
		};
	};
	return (
		<Box style={{ position: "relative" }}>
			{props.renderDefault({
				...props,
				elementProps: {
					...props.elementProps,
					/** @ts-ignore */
					readOnly: doesHaveCustomColor ? false : true,
					/** @ts-ignore */
					value: doesHaveCustomColor && props.value || color,
				},
			})}
			<Card
				flex={1}
				border={true}
				style={{
					position: "absolute",
					top: "1px",
					right: "1px",
					width: "33.333%",
					height: "calc(100% - 2px)",
					/** @ts-ignore */
					backgroundColor: doesHaveCustomColor ? props.value : color,
					borderRadius: "0.125em",
					borderTop: "unset",
					borderRight: "unset",
					borderBottom: "unset",
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
				}}
			></Card>
		</Box>
	);
};