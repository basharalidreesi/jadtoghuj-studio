import { ImageIcon } from "@sanity/icons"

export default {
	name: "imageBlock",
	type: "image",
	title: "Image",
	description: "",
	icon: ImageIcon,
	preview: {
		select: {
			originalFilename: "asset.originalFilename",
			asset: "asset",
		},
		prepare(selection) {
			const { originalFilename, asset } = selection
			return {
				title: originalFilename,
				subtitle: "Image Block",
				media: asset ? asset : ImageIcon
			}
		},
	}
}