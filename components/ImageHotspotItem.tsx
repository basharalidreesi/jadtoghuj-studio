import { DefaultPreview, ObjectItemProps } from "sanity";
import { portableTextToPlainText } from "../utils/portableTextUtils";
import { Text } from "@sanity/ui";

export const ImageHotspotItem = (props: ObjectItemProps & { value: any; }) => {
	const {
		value,
		renderDefault,
		inputProps,
		index,
	} = props;

	const details = value?.details;
	const x = value?.x;
	const y = value?.y;
	
	return renderDefault({
		...props,
		inputProps: {
			...inputProps,
			renderPreview: () => (
				<DefaultPreview
					title={portableTextToPlainText(details)}
					subtitle={x && y ? `${x}% × ${y}%` : "No position set"}
					media={() => (<Text size={1}>{index + 1}</Text>)}
				/>
			),
		},
	});
};

// Areas for improvement
// - Update index number when re-ordering