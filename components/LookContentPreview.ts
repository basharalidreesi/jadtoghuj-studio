import { PreviewProps, useFormValue } from "sanity";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { getThumbnailFromSanityAsset } from "../utils/imageUtils";
import { SparkleIcon } from "@sanity/icons";

export const LookContentPreview = (props: PreviewProps & { _key?: string; name?: string; asset?: SanityAsset; _description?: string; }) => {
	const looksArray = useFormValue(["lookContent"]) as { _key?: string; }[];
	const currentIndex = looksArray?.findIndex((looksArrayItem) => looksArrayItem._key === props._key);
	const thumbnail = props.asset ? getThumbnailFromSanityAsset(props.asset, 500) : null;
	return props.renderDefault({
		...props,
		title: [`Look ${currentIndex + 1}`, props.name]?.filter(Boolean)?.join(" · "),
		// @ts-ignore
		media: thumbnail || SparkleIcon || undefined,
		description: props._description,
		layout: "detail",
	});
};