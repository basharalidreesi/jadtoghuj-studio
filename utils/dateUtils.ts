export const isoDateToReadableDate = (
	isoDateString: string,
	options: {
		isAbbreviated?: boolean;
		doesIncludeDay?: boolean;
		doesIncludeMonth?: boolean;
	},
) => {
	const {
		isAbbreviated = false,
		doesIncludeDay = true,
		doesIncludeMonth = true,
	} = options;
	if (isoDateString) {
		const dateObj = new Date(isoDateString);
		return new Intl.DateTimeFormat("en-GB", {
			day: doesIncludeDay ? "numeric" : undefined,
			month: doesIncludeMonth ? (isAbbreviated ? "short" : "long") : undefined,
			year: "numeric",
		}).format(dateObj);
	};
	return null;
};