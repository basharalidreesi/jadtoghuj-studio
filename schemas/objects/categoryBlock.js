import { TagIcon } from "@sanity/icons"
import { previewArrayValues } from "../../lib/previewArrayValues"

export default {
	name: "categoryBlock",
	type: "object",
	title: "Categories",
	icon: TagIcon,
	fields: [
		{
			name: "categories",
			type: "array",
			title: "Categories",
			description: "",
			of: [
				{
					type: "reference",
					title: "Category",
					to: [{ type: "category" }],
					options: {
						disableNew: true,
						filter: async ({document}) => {
							const referencedCategories = document?.contents?.filter(block => block?._type === "categoryBlock")?.map(doc => doc?.categories?.map(category => category?._ref))?.filter(Boolean)?.flat() || ""
							return {
								filter: '!(_id in $referencedCategories)',
								params: {
									referencedCategories,
								}
							}
						},
					},
				},
			],
		},
	],
	preview: {
		select: {
			category0: "categories.0.title",
			category1: "categories.1.title",
			category2: "categories.2.title",
			category3: "categories.3.title",
		},
		prepare(selection) {
			const { category0, category1, category2, category3 } = selection
			return {
				title: previewArrayValues(category0, category1, category2, category3),
				subtitle: category1 ? "Categories" : "Category",
			}
		},
	},
}