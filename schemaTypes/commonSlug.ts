import { defineType } from "sanity";

export default defineType({
	name: "commonSlug",
	type: "slug",
	description: "The URL-friendly identifier for this item, generated from its name or title. Changing the slug after publication may cause broken links.",
});