import { PreviewProps, useFormValue } from "sanity";

export const SelectMediaPreview = (props: PreviewProps & { selectMediaItems?: string[]; }) => {
	const mediaContent = useFormValue(["mediaContent"]) || [];
	const selectMediaItemsStrings = props.selectMediaItems || [];
	const selectMediaReferenceNames: (string | null)[] = [];

	selectMediaItemsStrings.map((selectMediaItemString = "") => {
		try {
			const selectMediaItem = JSON.parse(selectMediaItemString) || {};
			const correspondingMediaContentItem = (mediaContent as Array<{_key: string; referenceName: string;}>).find((item) => item._key === selectMediaItem?.mediaItemKey);
			const correspondingMediaContentItemReferenceName = correspondingMediaContentItem?.referenceName || "Untitled";
			selectMediaReferenceNames.push(correspondingMediaContentItem ? correspondingMediaContentItemReferenceName : "Missing");
		} catch(error) {
			// console.error("Error parsing data:", error);
		};
	});
	
	return props.renderDefault({
		...props,
		title: ["Media", selectMediaReferenceNames.filter(Boolean)?.join(" · ") || "None selected"]?.filter(Boolean)?.join(" · "),
	});
};