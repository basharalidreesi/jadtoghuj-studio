import { apiVersion } from "./sanity.client"
import { BillIcon, CogIcon, DatabaseIcon, FilterIcon, HomeIcon, RocketIcon, SparklesIcon, TagIcon, UsersIcon } from "@sanity/icons"

// TODO

const hiddenTypes = new Set([
	"category",
	"look",
	"entity",
	"news",
	"page",
	"project",
	"settings",
])

export const structure = (S, context) => {
	return S.list()
		.title("Library")
		.items([
			S.listItem()
				.title("Looks")
				.icon(SparklesIcon)
				.child(
					S.documentTypeList("look")
						.title("Looks")
						.menuItems([])
						.defaultLayout("detail")
						.defaultOrdering([{ field: "title", direction: "asc" }])
				),
			S.listItem()
				.title("Projects")
				.icon(DatabaseIcon)
				.child(
					S.documentTypeList("project")
						.title("Projects")
						.menuItems([])
						.defaultLayout("detail")
						.defaultOrdering([
							{ field: "year", direction: "desc" },
							{ field: "title", direction: "asc" },
						])
				),
			S.listItem()
				.title("Categories")
				.icon(TagIcon)
				.child(
					S.documentTypeList("category")
						.title("Categories")
						.menuItems([])
						.defaultOrdering([{ field: "title", direction: "asc" }])
				),
			S.divider(),
			S.listItem()
				.title("News")
				.icon(RocketIcon)
				.child(
					S.documentTypeList("news")
						.title("News")
						.menuItems([])
						.defaultOrdering([
							{ field: "datePublished", direction: "desc" },
							{ field: "publisher", direction: "asc" },
							{ field: "title", direction: "asc" },
						])
				),
			S.listItem()
				.title("Entities")
				.icon(UsersIcon)
				.child(
					S.documentTypeList("entity")
						.title("Entities")
						.menuItems([])
						.defaultOrdering([{ field: "name", direction: "asc" }])
				),
			S.divider(),
			S.listItem()
				.title("Pages")
				.icon(BillIcon)
				.child(
					S.documentTypeList("page")
						.title("Pages")
						.menuItems([])
						.defaultOrdering([{field: "title", direction: "asc"}])
				),
			S.listItem()
				.title("Homepage")
				.icon(HomeIcon)
				.child(
					S.document()
						.schemaType("page")
						.documentId("homepage")
				),
			S.listItem()
				.title("Settings")
				.icon(CogIcon)
				.child(
					S.document()
						.schemaType("settings")
						.documentId("settings")
				),
			S.divider(),
			// S.listItem()
			// 	.title("Website")
			// 	.icon(EarthGlobeIcon)
			// 	.child(
			// 		S.list()
			// 			.title("Website")
			// 			.items([])
			// 	),
			// S.listItem()
			// 	.title("Filters")
			// 	.icon(FilterIcon)
			// 	.child(
			// 		S.list()
			// 			.title("Filters")
			// 			.items([
			// 				S.listItem()
			// 					.title("Public projects")
			// 					.child(
			// 						S.documentTypeList("project")
			// 							.title("Public projecs")
			// 							.id("noCreate-publicProjects")
			// 							.filter('_type == "project" && isPublic == true')
			// 							.menuItems([])
			// 							.defaultLayout("detail")
			// 							.defaultOrdering([
			// 								{ field: "year", direction: "desc" },
			// 								{ field: "title", direction: "asc" },
			// 							])
			// 					),
			// 				S.listItem()
			// 					.title("Private projects")
			// 					.child(
			// 						S.documentTypeList("project")
			// 							.title("Private projects")
			// 							.id("noCreate-privateProjects")
			// 							.filter('_type == "project" && isPublic != true')
			// 							.menuItems([])
			// 							.defaultLayout("detail")
			// 							.defaultOrdering([
			// 								{ field: "year", direction: "desc" },
			// 								{ field: "title", direction: "asc" },
			// 							])
			// 					),
			// 				S.listItem()
			// 					.title("Projects by year")
			// 					.child(() => {
			// 						const query = `*[_type == "project"] | order(year desc) { year }`
			// 						const params = {}
			// 						return context.getClient({apiVersion}).fetch(query, params).then((documents) => {
			// 							const years = []
			// 							documents.forEach((document) => {
			// 								const year = document?.year
			// 								if (!years.includes(year)) { years.push(year) }
			// 							})
			// 							return S.list()
			// 								.title("Projects by year")
			// 								.items(
			// 									years.map((year) => {
			// 										return S.listItem()
			// 											.title(`${year}`)
			// 											.id(`projectsFrom${year}`)
			// 											.child(
			// 												S.documentList()
			// 													.title(`Projects from ${year}`)
			// 													.id(`noCreate-projectsFrom${year}`)
			// 													.filter('_type == "project" && year == $year')
			// 													.params({ year: year })
			// 													.defaultLayout("detail")
			// 													.defaultOrdering([{ field: "title", direction: "asc" }])
			// 											)
			// 									}),
			// 								)
			// 						})
			// 					}),
			// 				S.listItem()
			// 					.title("Projects by category")
			// 					.child(() => {
			// 						const query = `*[_type == "category"] | order(lower(title) asc) { _id, title }`
			// 						const params = {}
			// 						return context.getClient({apiVersion}).fetch(query, params).then((documents) => {
			// 							return S.list()
			// 								.title("Projects by category")
			// 								.items(
			// 									documents.map((document) => {
			// 										return S.listItem()
			// 											.title(document.title)
			// 											.id(document._id)
			// 											.child((categoryId) =>
			// 												S.documentList()
			// 													.title(document.title)
			// 													.id(`noCreate-${document._id}`)
			// 													.filter('_type == "project" && $categoryId in categories[]._ref')
			// 													.params({ categoryId: categoryId })
			// 													.defaultLayout("detail")
			// 													.defaultOrdering([{ field: "title", direction: "asc" }])
			// 											)
			// 									}),
			// 								)
			// 						})
			// 					}),
			// 				S.listItem()
			// 					.title("Projects by person")
			// 					.id("projectsByPerson")
			// 					.child(() => {
			// 						const query = `
			// 							*[_type == "person"] | order(lower(name) asc) {
			// 								_id,
			// 								name,
			// 								"referencedLooks": *[_type == "look" && references(^._id)]._id,
			// 							}
			// 						`
			// 						const params = {}
			// 						return context.getClient({apiVersion}).fetch(query, params).then((documents) => {
			// 							return S.list()
			// 								.title("Projects by person")
			// 								.items(
			// 									documents.map((document) => {
			// 										return S.listItem()
			// 											.title(document.name)
			// 											.id(document._id)
			// 											.child((personId) =>
			// 												S.documentList()
			// 													.title(`Projects with "${document.name}"`)
			// 													.id(`noCreate-${document._id}`)
			// 													.filter('(_type == "project" && references($personId)) || (_type == "project" && references($referencedLooks))')
			// 													.params({ personId: personId, referencedLooks: document.referencedLooks })
			// 													.defaultLayout("detail")
			// 													.defaultOrdering([{ field: "name", direction: "asc" }])
			// 											)
			// 									})
			// 								)
			// 						})
			// 					}),
			// 			])
			//	),
			// S.divider(),
			...S.documentTypeListItems().filter((type) => !hiddenTypes.has(type.spec.id))
		])
}