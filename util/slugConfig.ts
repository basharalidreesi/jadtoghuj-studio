import slugify from "@sindresorhus/slugify";
import { SlugValue } from "sanity";

const slugConfig = {
	customSlugify: function(value: string | undefined) {
		if (!value) { return ""; };
		return slugify(value, {
			customReplacements: [
				["×", "x"],
			],
		});
	},
	requireSlug: function(value: SlugValue | undefined) {
		if (!value || !value?.current || value?.current?.trim()?.length === 0) { return "Required"; };
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/g.test(value?.current)) { return "Invalid slug"; };
		return true;
	},
};

export default slugConfig;