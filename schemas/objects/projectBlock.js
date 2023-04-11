import { BookIcon } from "@sanity/icons"
import { previewArrayValues } from "../../lib/previewArrayValues"

export default {
	name: "projectBlock",
	type: "object",
	title: "Project",
	icon: BookIcon,
	fields: [
		{
			name: "projects",
			type: "array",
			title: "Projects",
			description: "",
			of: [
				{
					type: "reference",
					title: "Project",
					to: [{ type: "project" }],
					options: {
						disableNew: true,
						filter: async ({document}) => {
							const referencedProjects = document?.contents?.filter(block => block?._type === "projectBlock")?.map(doc => doc?.projects?.map(project => project?._ref))?.filter(Boolean)?.flat() || ""
							return {
								filter: '!(_id in $referencedProjects) && isPublic == true && defined(address.current)',
								params: {
									referencedProjects,
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
			project0: "projects.0.title",
			project1: "projects.1.title",
			project2: "projects.2.title",
			project3: "projects.3.title",
		},
		prepare(selection) {
			const { project0, project1, project2, project3 } = selection
			return {
				title: previewArrayValues(project0, project1, project2, project3),
				subtitle: "Project Block",
			}
		},
	},
}