import { LinkIcon } from "@sanity/icons"
import { defineField } from "sanity"

export default defineField({
	name: "_reference",
	type: "object",
	title: "Reference",
	icon: LinkIcon,
	fieldsets: [
		{
			name: "titleAndSource",
			title: "Title & Source",
			options: {
				columns: 2,
			},
		},
	],
	fields: [
		defineField({
			name: "url",
			type: "url",
			title: "URL",
			description: "",
		}),
		defineField({
			name: "title",
			type: "string",
			title: "Title",
			description: "",
			fieldset: "titleAndSource",
		}),
		defineField({
			name: "source",
			type: "string",
			title: "Source",
			description: "",
			fieldset: "titleAndSource",
		}),
	],
	options: {
		exposedArrayConstraints: {
			includeInExposedArray: false,
		},
	},
	components: {
		input: (props) => {
			return (
				<>
					<style>{`
						fieldset[data-testid="fieldset-titleAndSource"] > *:first-child {
							display: none !important;
						}
						fieldset[data-testid="fieldset-titleAndSource"] > *:nth-child(2) {
							border-left: none !important;
							padding-left: 0 !important;
						}
					`}</style>
					{props.renderDefault(props)}
				</>
			)
		},
	},
	preview: {
		select: {
			url: "url",
			title: "title",
			source: "source",
		},
		prepare(selection) {
			const {
				url,
				title,
				source,
			} = selection
			var subtitle = null
			try {
				subtitle = new URL(url)?.hostname?.replace("www.", "")
			} catch {}
			return {
				title: title || url || null,
				subtitle: source || subtitle,
			}
		},
	},
})