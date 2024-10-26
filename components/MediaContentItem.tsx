import { DefaultPreview, ObjectItemProps } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { Badge } from "@sanity/ui";

export const MediaContentItem = (props: ObjectItemProps & { value: any; }) => {
	const {
		value,
		renderDefault,
		inputProps,
	} = props;
	const referenceName = value?.referenceName;
	const isMarkedAsNewLook = value?.isMarkedAsNewLook;
	return renderDefault({
		...props,
		inputProps: {
			...inputProps,
			renderPreview: () => (
				<DefaultPreview
					title={referenceName}
					subtitle={props.title}
					media={<DocumentIcon />}
					status={() => isMarkedAsNewLook && (<Badge>Look</Badge>)}
				/>
			),
		},
	});
};