import { defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const studioInformationIcon = InfoOutlineIcon;

export default defineType({
	name: "studioInformation",
	type: "document",
	title: "Studio Information",
	icon: studioInformationIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Name",
			// description
		}),
		defineField({
			name: "logo",
			type: "image",
			title: "Logo",
			// description
			options: {
				accept: ".svg",
				storeOriginalFilename: false,
			},
		}),
		defineField({
			name: "email",
			type: "string",
			title: "Email",
			// description
		}),
		defineField({
			name: "instagramLink",
			type: "url",
			title: "Instagram Link",
			// description
		}),
		defineField({
			name: "shortDescription",
			type: "text",
			title: "Short Description",
			// description
			rows: 3,
		}),
		defineField({
			name: "longDescription",
			type: "text",
			title: "Long Description",
			// description
			rows: 3,
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