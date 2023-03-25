import { BookIcon, CogIcon, DocumentsIcon, EarthGlobeIcon, FilterIcon, HeartIcon, TagIcon, UsersIcon } from "@sanity/icons"
import { supportedWebsites } from "./lib/websites"
import { apiVersion } from "./sanity.client"

const hiddenDocumentTypes = listItem => ![
	"campaign",
	"category",
	"look",
	"page",
	"person",
	"project",
	"settings",
].includes(listItem.getId())

export const structure = (S, context) =>
	S.list()
		.title("Library")
		.items([
			S.listItem()
				.title("Projects")
				.icon(BookIcon)
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
			S.listItem()
				.title("Campaigns")
				.icon(HeartIcon)
				.child(
					S.documentTypeList("campaign")
						.title("Campaigns")
						.menuItems([])
						.defaultOrdering([{ field: "title", direction: "asc" }])
				),
			S.listItem()
				.title("People")
				.icon(UsersIcon)
				.child(
					S.documentTypeList("person")
						.title("People")
						.menuItems([])
						.defaultOrdering([{ field: "name", direction: "asc" }])
				),
			S.divider(),
			...supportedWebsites.map(website => {
				return S.listItem()
					.title(supportedWebsites.length === 1 ? "Website" : website.title)
					.icon(EarthGlobeIcon)
					.child(
						S.list()
							.title(supportedWebsites.length === 1 ? "Website" : website.title)
							.items([
								S.listItem()
									.title("Pages")
									.icon(DocumentsIcon)
									.child(
										S.documentTypeList("page")
											.title(supportedWebsites.length === 1 ? "Pages" : `Pages for ${website.title}`)
											.filter(`_type == "page" && website == "${website.value}"`)
											.menuItems([])
											.defaultOrdering([{field: "title", direction: "asc"}])
											.initialValueTemplates([
												S.initialValueTemplateItem(`page-for-${website.value}`)
											])
									),
								S.listItem()
									.title("Settings")
									.icon(CogIcon)
									.child(
										S.document()
											.schemaType("settings")
											.id("d5ca9e8b-c1e1-49f3-b0ea-0e7666d124f1")
											.initialValueTemplate(`settings-for-${website.value}`)
									),
							])
					)
			}),
			S.divider(),
			S.listItem()
				.title("Filters")
				.icon(FilterIcon)
				.child(
					S.list()
						.title("Filters")
						.items([
							S.listItem()
								.title("Projects by publishing status")
								.child(
									S.list()
										.title("Projects by publishing status")
										.items([
											S.listItem()
												.title("Published projects")
												.child(
													S.documentTypeList("project")
														.title("Published projecs")
														.id("noCreate-publishedProjects")
														.filter('_type == "project" && !(_id in path("drafts.**"))')
														.menuItems([])
														.defaultLayout("detail")
														.defaultOrdering([
															{ field: "year", direction: "desc" },
															{ field: "title", direction: "asc" },
														])
												),
											S.listItem()
												.title("Modified projects")
												.child(
													S.documentTypeList("project")
														.title("Modified projects")
														.id("noCreate-modifiedProjects")
														.filter('_type == "project" && (count(*[_id in [^._id, "drafts." + ^._id]]) > 1)')
														.menuItems([])
														.defaultLayout("detail")
														.defaultOrdering([
															{ field: "year", direction: "desc" },
															{ field: "title", direction: "asc" },
														])
												),
											S.listItem()
												.title("Unpublished projects")
												.child(
													S.documentTypeList("project")
														.title("Unpublished projects")
														.id("noCreate-unpublishedProjects")
														.filter('_type == "project" && (_id in path("drafts.**") && count(*[^._id == "drafts." + _id]) == 0)')
														.menuItems([])
														.defaultLayout("detail")
														.defaultOrdering([
															{ field: "year", direction: "desc" },
															{ field: "title", direction: "asc" },
														])
												),
										])
								),
							S.listItem()
								.title("Projects by year")
								.child(() => {
									const query = `*[_type == "project"] | order(year desc) { year }`
									const params = {}
									return context.getClient({apiVersion}).fetch(query, params).then(docs => {
										const years = []
										docs.forEach(doc => {
											const year = doc?.year
											if (!years.includes(year)) { years.push(year) }
										})
										return S.list()
											.title("Projects by year")
											.items(
												years.map(year => {
													return S.listItem()
														.title(`${year}`)
														.id(`projectsFrom${year}`)
														.child(
															S.documentList()
																.title(`Projects from ${year}`)
																.id(`noCreate-projectsFrom${year}`)
																.filter('_type == "project" && year == $year')
																.params({ year: year })
																.defaultLayout("detail")
																.defaultOrdering([{ field: "title", direction: "asc" }])
														)
												}),
											)
									})
								}),
							S.listItem()
								.title("Projects by category")
								.child(() => {
									const query = `*[_type == "category"] | order(title asc) { _id, title }`
									const params = {}
									return context.getClient({apiVersion}).fetch(query, params).then(docs => {
										return S.list()
											.title("Projects by category")
											.items(
												docs.map(doc => {
													return S.listItem()
														.title(doc.title)
														.id(doc._id)
														.child(categoryId =>
															S.documentList()
																.title(doc.title)
																.id(`noCreate-${doc._id}`)
																.filter('_type == "project" && $categoryId in categories[]._ref')
																.params({ categoryId: categoryId })
																.defaultLayout("detail")
																.defaultOrdering([{ field: "title", direction: "asc" }])
														)
												}),
											)
									})
								}),
							S.listItem()
								.title("Projects by person(s)")
								.id("projectsByPersons")
								.child(() => {
									const query = `
										*[_type == "person"] | order(name asc) {
											_id,
											name,
											"referencedLooks": *[_type == "look" && references(^._id)]._id,
										}
									`
									const params = {}
									return context.getClient({apiVersion}).fetch(query, params).then(docs => {
										return S.list()
											.title("Projects by person(s)")
											.items(
												docs.map(doc => {
													return S.listItem()
														.title(doc.name)
														.id(doc._id)
														.child(personId =>
															S.documentList()
																.title(`Projects with "${doc.name}"`)
																.id(`noCreate-${doc._id}`)
																.filter('(_type == "project" && references($personId)) || (_type == "project" && references($referencedLooks))')
																.params({ personId: personId, referencedLooks: doc.referencedLooks })
																.defaultLayout("detail")
																.defaultOrdering([{ field: "name", direction: "asc" }])
														)
												})
											)
									})
								}),
						])
				),
			S.divider(),
			...S.documentTypeListItems().filter(hiddenDocumentTypes)
		])