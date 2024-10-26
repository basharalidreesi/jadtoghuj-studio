import { InputProps } from "sanity";
import { Box, Card } from "@sanity/ui";

export const ColourInput = (props: InputProps) => {
	return (
		<Box style={{ position: "relative" }}>
			{props.renderDefault(props)}
			<Card
				flex={1}
				border={true}
				style={{
					position: "absolute",
					top: "1px",
					right: "1px",
					width: "33.333%",
					height: "calc(100% - 2px)",
					// @ts-ignore
					backgroundColor: props.value,
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