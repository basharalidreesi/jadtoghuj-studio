const stringConfig = {
	DEFAULT_BACKGROUND_COLOR: "#91a3b0",
	DEFAULT_FOREGROUND_COLOR: "#000000",
	requireString: function(value: string | undefined) {
		if (!value || value?.trim()?.length === 0) { return "Required"; };
		return true;
	},
	isValidCssColourString: function(value: string | undefined) {
		if (!value) { return true; };
		const s = new Option().style;
		s.color = value;
		if (["", "inherit", "initial", "transparent", "unset"].includes(s.color)) { return "Not a valid color"; };
		return true;
	},
};

export default stringConfig;