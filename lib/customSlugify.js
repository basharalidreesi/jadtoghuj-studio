import slugify from "@sindresorhus/slugify"

export default function customSlugify(value) {
	if (!value) { return }
	return slugify(value, {
		customReplacements: [
			["×", "x"],
		],
	})
}