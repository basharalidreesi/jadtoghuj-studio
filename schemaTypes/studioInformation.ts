import { defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const studioInformationIcon = InfoOutlineIcon;

export default defineType({
	name: "studioInformation",
	type: "document",
	title: "Studio Information",
	icon: studioInformationIcon,
	__experimental_omnisearch_visibility: false,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Name",
			// TODO description
		}),
		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
			// TODO description
			options: {
				accept: ".svg",
				storeOriginalFilename: false,
			},
		}),
		defineField({
			name: "email",
			type: "string",
			title: "Email",
			// TODO description
		}),
		defineField({
			name: "instagramLink",
			type: "url",
			title: "Instagram Link",
			// TODO description
		}),
		defineField({
			name: "shortDescription",
			type: "text",
			title: "Short Description",
			// TODO description
			rows: 3,
		}),
		defineField({
			name: "longDescription",
			type: "text",
			title: "Long Description",
			// TODO description
			rows: 5,
		}),
	],
	preview: {
		prepare() {
			return {
				title: "Studio",
			};
		},
	},
});