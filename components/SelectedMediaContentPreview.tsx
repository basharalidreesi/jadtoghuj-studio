import { PreviewProps, useFormValue } from "sanity";

export const SelectedMediaContentPreview = (props: PreviewProps & { selectedMediaContentItems?: string[]; }) => {
	const mediaContent = useFormValue(["mediaContent"]) || [];
	const selectedMediaContentItemsStrings = props.selectedMediaContentItems || [];
	const selectedMediaContentReferenceNames: (string | null)[] = [];

	selectedMediaContentItemsStrings.map((selectedMediaContentItemString = "") => {
		try {
			const selectedMediaContentItem = JSON.parse(selectedMediaContentItemString) || {};
			const correspondingMediaContentItem = (mediaContent as Array<{_key: string; referenceName: string;}>).find((item) => item._key === selectedMediaContentItem?.mediaContentItemKey);
			const correspondingMediaContentItemReferenceName = correspondingMediaContentItem?.referenceName || "Untitled";
			selectedMediaContentReferenceNames.push(correspondingMediaContentItem ? correspondingMediaContentItemReferenceName : null);
		} catch(error) {
			// console.error("Error parsing data:", error);
		};
	});
	
	return props.renderDefault({
		...props,
		title: selectedMediaContentReferenceNames.filter(Boolean)?.join(" · "),
		subtitle: "Selected Media",
	});
};