import { defineArrayMember, defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import { LookContentPreview } from "../components";

export default defineType({
	name: "lookContent",
	type: "array",
	of: [
		defineArrayMember({ // TODO consider other types
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
					type: "simplePortableText",
					title: "Description",
					description: "A brief description of this look.",
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