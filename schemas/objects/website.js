import { supportedWebsites } from "../../lib/websites"

export default {
	name: "website",
	type: "string",
	title: "Website",
	options: {
		list: supportedWebsites.map(website => ({
			title: website.title,
			value: website.value,
		})),
		layout: "radio",
	},
	hidden: true,
}