export default {
	name: "portableText",
	type: "array",
	title: "Portable Text",
	of: [
		{
			type: "block",
			of: [
				{
					name: "person",
					type: "reference",
					title: "Person",
					to: [{ type: "person" }],
				},
			],
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
					{
						title: "Underline",
						value: "underline",
					},
					{
						title: "Strike",
						value: "strike-through",
					},
				],
				annotations: [
					{
						name: "link",
						type: "object",
						title: "Link",
						fields: [
							{
								name: "url",
								type: "url",
								title: "URL",
							},
						],
					},
				],
			},
		},
	],
}