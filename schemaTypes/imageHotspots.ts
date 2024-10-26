import { defineArrayMember, defineType } from "sanity";
import { ImageHotspotPreview } from "../components";

export default defineType({
	name: "imageHotspots",
	type: "array",
	title: "Image Hotspots",
	of: [
		defineArrayMember({
			type: "imageHotspot",
		}),
	],
	options: {
		imageHotspot: {
			pathRoot: "parent",
			imagePath: "image",
			tooltip: ImageHotspotPreview,
		},
	},
});