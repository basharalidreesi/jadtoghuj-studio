import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "r5iw9ewg",
		dataset: "production",
	},
	studioHost: "jadtoghuj",
	/**
	* Enable auto-updates for studios.
	* Learn more at https://www.sanity.io/docs/cli#auto-updates
	*/
	autoUpdates: true,
});