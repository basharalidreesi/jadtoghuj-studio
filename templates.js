import { supportedWebsites } from "./lib/websites"

export const templates = (prev) => [
	...prev,
	...supportedWebsites.map(website => {
		return {
			id: `page-for-${website.value}`,
			title: `Page for ${website.title}`,
			schemaType: "page",
			value: {
				"website": website.value,
			},
		}
	}),
	...supportedWebsites.map(website => {
		return {
			id: `settings-for-${website.value}`,
			title: `Settings for ${website.title}`,
			schemaType: "settings",
			value: {
				"website": website.value,
			},
		}
	}),
]