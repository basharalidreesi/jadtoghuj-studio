import { FieldProps, useFormValue } from "sanity";

const titleDef = "The title that appears in search engine results and social media previews";
const descDef = "The summary that appears in search engine results and social media previews";
const ogImageDef = (docType: string) => `The image that appears when this ${docType} is shared on Facebook, WhatsApp, and others`;
const ogImageRec = "Recommended size: 1200 × 630 pixels";
const twitterImageDef = (docType: string) => `The image that appears when this ${docType} is shared on Twitter`;
const twitterImageRec = "Recommended size: 1200 × 600 pixels";

export const MetadataDescriptions = (props: FieldProps) => {
	const documentType = useFormValue(["_type"]);
	const fieldName = props.name;
	let label = undefined;
	if (documentType === "article") {
		if (fieldName === "title") {
			label = `${titleDef}. Leave blank to use the default headline.`;
		};
		if (fieldName === "description") {
			label = `${descDef}. Leave blank to use the default summary. If both are blank, the studio's short description will be used.`;
		};
		if (fieldName === "openGraphImage") {
			label = `${ogImageDef("article")}. Leave blank to use the hero image. If both are blank, the studio's logo will be used. ${ogImageRec}.`;
		};
		if (fieldName === "twitterImage") {
			label = `${twitterImageDef("article")}. Leave blank to use the hero image. If both are blank, the studio's logo will be used. ${twitterImageRec}.`;
		};
	};
	if (documentType === "category") {
		if (fieldName === "title") {
			label = `${titleDef}. Leave blank to use the default category name.`;
		};
		if (fieldName === "description") {
			label = `${descDef}. If blank, the studio's short description will be used.`;
		};
		if (fieldName === "openGraphImage") {
			label = `${ogImageDef("category page")}. If blank, the studio's logo will be used. ${ogImageRec}.`;
		};
		if (fieldName === "twitterImage") {
			label = `${twitterImageDef("category page")}. If blank, the studio's logo will be used. ${twitterImageRec}.`;
		};
	};
	if (documentType === "project") {
		if (fieldName === "title") {
			label = `${titleDef}. Leave blank to use the default title.`;
		};
		if (fieldName === "description") {
			label = `${descDef}. Leave blank to use the default summary. If both are blank, the studio's short description will be used.`;
		};
		if (fieldName === "openGraphImage") {
			label = `${ogImageDef("project")}. If blank, the studio's logo will be used. ${ogImageRec}.`;
		};
		if (fieldName === "twitterImage") {
			label = `${twitterImageDef("project")}. If blank, the studio's logo will be used. ${twitterImageRec}.`;
		};
	};
	return props.renderDefault({
		...props,
		description: label,
	});
};