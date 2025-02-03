import { useEffect, useState } from "react";
import { ImageValue, useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityAsset } from "@sanity/image-url/lib/types/types";

export const requireAsset = (value: ImageValue | undefined) => {
	if (!value || !value.asset) { return "Required"; };
	return true;
};

export const buildSanityImageUrl = (value: SanityAsset, width: number = 500) => {
	const [data, setData] = useState("");
	const client = useClient({ apiVersion: "2025-02-01", });
	const imageBuilder = imageUrlBuilder(client);
	useEffect(() => {
		async function getData() {
			const data = imageBuilder.image(value)?.width(width)?.url() as string;
			setData(data);
		};
		getData();
	}, [value]);
	return data;
};

export const getThumbnailFromSanityAsset = (value: SanityAsset, width?: number) => {
	const url = value ? buildSanityImageUrl(value, width) : null;
	if (!url) { return null; };
	return (<img src={url} />);
};