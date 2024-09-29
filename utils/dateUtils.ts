export const isoDateToReadableDate = (isoDateString: string, isAbbreviated = false) => {
	if (isoDateString) {
		const dateObj = new Date(isoDateString);
		return new Intl.DateTimeFormat("en-GB", {
			day: "numeric", 
			month: isAbbreviated ? "short" : "long",
			year: "numeric",
		}).format(dateObj);
	};
	return null;
};