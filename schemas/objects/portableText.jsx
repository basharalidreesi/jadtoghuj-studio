import { defineField } from "sanity"
import { LinkIcon, UserIcon } from "@sanity/icons"

export default defineField({
	name: "portableText",
	type: "array",
	title: "Portable Text",
	of: [
		defineField({
			type: "block",
			styles: [
				{
					title: "Normal",
					value: "normal",
				},
			],
			lists: [],
			marks: {
				decorators: [
					{
						title: "Strong",
						value: "strong",
					},
					{
						title: "Emphasis",
						value: "em",
					},
				],
				annotations: [
					{
						name: "link",
						type: "object",
						title: "Link",
						icon: LinkIcon,
						fields: [
							defineField({
								name: "url",
								type: "url",
								title: "URL",
								description: "",
							}),
						],
					},
				],
			},
			of: [
				defineField({
					name: "entity",
					type: "reference",
					title: "Reference",
					description: "",
					icon: UserIcon,
					to: [{ type: "entity" }],
				}),
			],
		}),
	],
})