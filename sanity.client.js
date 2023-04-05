import { createClient } from "@sanity/client"

export const projectId = "nhelboup"
export const dataset = "production"
export const useCdn = true
export const apiVersion = "2023-04-05"

export const client = createClient({
	projectId,
	dataset,
	useCdn,
	apiVersion,
})