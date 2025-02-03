import { defineArrayMember, defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import { LookContentPreview } from "../components";

export default defineType({
	name: "lookContent",
	type: "array",
	of: [
		defineArrayMember({
			name: "look",
			type: "image",
			title: "Look",
			icon: SparkleIcon,
			fields: [
				defineField({
					name: "name",
					type: "string",
					title: "Name",
					description: "The name of this look.",
				}),
				defineField({
					name: "description",
					type: "text", // TODO replace with portable text
					title: "Description",
					description: "A brief description of this look.",
					rows: 3,
				}),
			],
			options: {
				storeOriginalFilename: false,
			},
			preview: {
				select: {
					_key: "_key",
					asset: "asset",
					name: "name",
					_description: "description",
				},
			},
			components: {
				preview: LookContentPreview,
			},
		}),
	],
});