import { defineField, defineType } from "sanity"
import { DatabaseIcon, IceCreamIcon, LinkIcon, TransferIcon, UserIcon } from "@sanity/icons"

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
						title: "Bold",
						value: "strong",
					},
					{
						title: "Italic",
						value: "em",
					},
					{
						title: "Bidirectional Input",
						value: "bdi",
						icon: TransferIcon,
						component: (props) => <bdi style={{ textDecoration: "underline", textDecorationStyle: "wavy" }}>{props.children}</bdi>,
					},
				],
				annotations: [
					defineType({
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
					}),
				],
			},
			of: [
				defineField({
					name: "entity",
					type: "reference",
					title: "Entity",
					icon: UserIcon,
					to: [{ type: "entity" }],
				}),
				defineField({
					name: "project",
					type: "reference",
					title: "Project",
					icon: DatabaseIcon,
					to: [{ type: "project" }],
					// TODO FILTER
				}),
				defineField({
					name: "press",
					type: "reference",
					title: "Press",
					icon: IceCreamIcon,
					to: [{ type: "press" }],
				}),
			],
		}),
	],
})