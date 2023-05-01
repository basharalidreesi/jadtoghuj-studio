export default {
	name: "looksInLookbookEntry",
	type: "array",
	title: "Looks in this entry",
	of: [
		{
			type: "reference",
			title: "Look",
			to: [{ type: "look" }],
			options: {
				disableNew: true,
				filter: ({document, parent}) => {
					const listedLooks = document?.looks?.map(look => look._ref)?.filter(Boolean) || ""
					const existingLooks = parent?.map(look => look._ref)?.filter(Boolean) || ""
					return {
						filter: '(_id in $listedLooks) && !(_id in $existingLooks)',
						params: {
							listedLooks,
							existingLooks,
						}
					}
				},
			},
		},
	],
}