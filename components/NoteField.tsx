import { Box, Card, Flex, Text } from "@sanity/ui";
import { BulbOutlineIcon } from "@sanity/icons";
import { StringFieldProps } from "sanity";

export const NoteField = (props: StringFieldProps & { description?: string; }) => {
	return (
		<Card padding={[2, 4]} radius={3} tone={"neutral"}>
			<Flex align="center">
			<Box style={{ flexShrink: 0, lineHeight: 0 }}>
				<BulbOutlineIcon style={{ fontSize: 24 }} />
			</Box>
			<Box marginLeft={3}>
				<Text size={[1, 1, 1]}>{props?.description}</Text>
			</Box>
			</Flex>
		</Card>
	);
};