import { FieldProps, useFormValue } from "sanity";

export const CustomMetadataDescriptions = (props: FieldProps) => {
	const documentType = useFormValue(["_type"]);
	const fieldName = props.name;
	let label = undefined;
	if (documentType === "article") {
		if (fieldName === "title") {
			label = "The title that appears in search engine results and social media previews. Leave blank to use the article's default headline.";
		};
		if (fieldName === "description") {
			label = "The summary that appears in search engine results and social media previews. Leave blank to use the article's default introduction. If both this field and the introduction are left blank, the studio's short description will be used.";
		};
		if (fieldName === "openGraphImage") {
			label = "The image that appears when this article is shared on Facebook, WhatsApp, and a number of other platforms. Leave blank to use the article's hero image. If both this field and the hero image field are left blank, the studio's logo will be used. Recommended size: 1200 × 630 pixels.";
		};
		if (fieldName === "twitterImage") {
			label = "The image that appears when this article is shared on Twitter. Leave blank to use the article's hero image. If both this field and the hero image field are left blank, the studio's logo will be used. Recommended size: 1200 × 600 pixels.";
		};
	};
	if (documentType === "category") {
		if (fieldName === "title") {
			label = "The title that appears in search engine results and social media previews. Leave blank to use the category's default name.";
		};
		if (fieldName === "description") {
			label = "The summary that appears in search engine results and social media previews. If left blank, the studio's short description will be used.";
		};
		if (fieldName === "openGraphImage") {
			label = "The image that appears when this category is shared on Facebook, WhatsApp, and a number of other platforms. If left blank, the studio's logo will be used. Recommended size: 1200 × 630 pixels.";
		};
		if (fieldName === "twitterImage") {
			label = "The image that appears when this category is shared on Twitter. If left blank, the studio's logo will be used. Recommended size: 1200 × 600 pixels.";
		};
	};
	if (documentType === "project") {
		if (fieldName === "title") {
			label = "The title that appears in search engine results and social media previews. Leave blank to use the project's default title.";
		};
		if (fieldName === "description") {
			label = "The summary that appears in search engine results and social media previews. If left blank, the studio's short description will be used.";
		};
		if (fieldName === "openGraphImage") {
			label = "The image that appears when this project is shared on Facebook, WhatsApp, and a number of other platforms. If left blank, the studio's logo will be used. Recommended size: 1200 × 630 pixels.";
		};
		if (fieldName === "twitterImage") {
			label = "The image that appears when this project is shared on Twitter. If left blank, the studio's logo will be used. Recommended size: 1200 × 600 pixels.";
		};
	};
	return props.renderDefault({
		...props,
		description: label,
	});
};