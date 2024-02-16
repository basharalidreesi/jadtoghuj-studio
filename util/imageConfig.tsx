import { useEffect, useState } from "react";
import { ImageValue } from "sanity";
import { mediaAssetSource } from "sanity-plugin-media";
import useSanityClient from "../sanity.client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityAsset } from "@sanity/image-url/lib/types/types";

export const imageSources = [mediaAssetSource];

const imageConfig = {
	options: {
		hotspot: true,
		storeOriginalFilename: false,
		sources: imageSources,
	},
	requireAsset: function(value: ImageValue | undefined) {
		if (!value || !value.asset) { return "Required"; };
		return true;
	},
	buildSanityImageUrl: function(value: SanityAsset, width: number = 500) {
		const [data, setData] = useState("");
		const client = useSanityClient();
		const imageBuilder = imageUrlBuilder(client);
		useEffect(() => {
			async function getData() {
				const data = imageBuilder.image(value)?.width(width)?.url() as string;
				setData(data);
			};
			getData();
		}, [value]);
		return data;
	},
	getThumbnailFromSanityAsset: function(value: SanityAsset, width?: number) {
		const url = value ? imageConfig.buildSanityImageUrl(value, width) : null;
		if (!url) { return null; };
		return (<img src={url} />);
	},
};

export default imageConfig;