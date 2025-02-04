import { defineArrayMember, defineType } from "sanity";
import { HotspotPreview } from "../components";

export default defineType({
	name: "imageHotspots",
	type: "array",
	of: [
		defineArrayMember({
			type: "imageHotspot",
		}),
	],
	options: {
		imageHotspot: {
			pathRoot: "parent",
			imagePath: "image",
			tooltip: HotspotPreview,
		},
	},
});