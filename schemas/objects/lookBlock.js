import { StarIcon } from "@sanity/icons"
import { apiVersion } from "../../sanity.client"
import { previewArrayValues } from "../../lib/previewArrayValues"

export default {
	name: "lookBlock",
	type: "object",
	title: "Look",
	icon: StarIcon,
	fields: [
		{
			name: "project",
			type: "reference",
			title: "Project",
			description: "",
			to: [{ type: "project" }],
			options: {
				disableNew: true,
				filter: 'isPublic == true && defined(address.current) && count(array::compact(looks[]->display.asset._ref)) >= 1'
			},
		},
		{
			name: "includeAllLooks",
			type: "boolean",
			title: "Include All Looks",
			description: "",
			initialValue: true,
		},
		{
			name: "looks",
			type: "array",
			title: "Looks",
			description: "",
			of: [
				{
					type: "reference",
					title: "Looks",
					to: [{ type: "look" }],
					options: {
						disableNew: true,
						filter: async ({document, parent, parentPath, getClient}) => {
							const currentKey = parentPath?.find(item => item?._key)?._key
							const referencedProject = document?.contents?.find(item => item?._key === currentKey)?.project?._ref || ""
							const looksInReferencedProject = await getClient({apiVersion}).fetch(`*[_id == $referencedProject].looks[]->_id`, {
								referencedProject,
							})
							const referencedDocuments = parent?.map(doc => doc?._ref)?.filter(Boolean) || ""
							return Promise.resolve({
								filter: '_id in $looksInReferencedProject && defined(display.asset._ref) && !(_id in $referencedDocuments)',
								params: {
									looksInReferencedProject,
									referencedDocuments,
								}
							})
						},
					},
					validation: (Rule) => Rule.custom(async (value, context) => {
						if (value._ref) {
							const { document, path, getClient } = context
							const currentKey = path?.find(item => item?._key)?._key
							const referencedLook = value._ref
							const referencedProject = document?.contents?.find(item => item?._key === currentKey)?.project?._ref || ""
							const looksInReferencedProject = await getClient({apiVersion}).fetch(`*[_id == $referencedProject].looks[]->_id`, {
								referencedProject,
							})
							if (!referencedProject) { return "This look's project must be specified." }
							if (!looksInReferencedProject.includes(referencedLook)) {
								return "This look does not correspond to the selected project."
							}
							return true
						}
						return true
					}),
				},
			],
			hidden: ({parent}) => parent?.includeAllLooks,
		},
	],
	preview: {
		select: {
			title: "project.title",
			look0: "looks.0.title",
			look1: "looks.1.title",
			look2: "looks.2.title",
			look3: "looks.3.title",
			ref0: "looks.0._ref",
			ref1: "looks.1._ref",
			ref2: "looks.2._ref",
			ref3: "looks.3._ref",
		},
		prepare(selection) {
			const { title, look0, look1, look2, look3, ref0, ref1, ref2, ref3 } = selection
			return {
				title: previewArrayValues(look0, look1, look2, look3, {
					prefix: title,
					begin: " (",
					end: ")",
					ref0: ref0,
					ref1: ref1,
					ref2: ref2,
					ref3: ref3,
					untitled: "Untitled Look",
				}),
				subtitle: "Look Block",
			}
		},
	},
}