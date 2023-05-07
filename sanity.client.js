import { createClient } from "@sanity/client"

export const projectId = "nhelboup"
export const dataset = "production"
export const useCdn = false
export const apiVersion = "2023-04-05"

const client = createClient({
	projectId,
	dataset,
	useCdn,
	apiVersion,
})

export default client