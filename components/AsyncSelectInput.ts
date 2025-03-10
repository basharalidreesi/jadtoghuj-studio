import { useState, useEffect } from "react";
import { StringInputProps, useFormValue } from "sanity";

export const AsyncSelectInput = (props: StringInputProps) => {
	const { schemaType, renderDefault, path, value } = props;
	const { options } = schemaType;
	// @ts-ignore
	const { url, formatResponse, sourceField } = options;

	const [listItems, setListItems] = useState<{ title: string; value: string }[]>([]);

	// Compute the path to the source field
	let sourceFieldPath = null;
	if (sourceField) {
		if (Array.isArray(sourceField)) {
			sourceFieldPath = sourceField;
		} else if (typeof sourceField === "string") {
			if (sourceField.startsWith("/")) {
				// Interpret as absolute path from root, split by "/"
				sourceFieldPath = sourceField.slice(1).split("/");
			} else {
				// Use the current path to resolve relative paths
				sourceFieldPath = [...path.slice(0, -1), sourceField];
			};
		};
	};

	// Get the value of the source field
	const sourceFieldValue = useFormValue(sourceFieldPath || []);

	useEffect(() => {
		if (sourceFieldPath) {
			try {
				// Use the source field value for the dropdown list
				const list = formatResponse ? formatResponse(sourceFieldValue) : sourceFieldValue;
				setListItems(list || []);
			} catch(error) {
				console.error("Error processing source field value:", error);
				setListItems([]);
			};
		} else if (url) {
			// Fetch data from the URL if sourceField is not specified
			const getData = async () => {
				try {
					const res = await fetch(url);
					const json = await res.json();
					const list = formatResponse ? formatResponse(json) : json;
					setListItems(list || []);
				} catch(error) {
					console.error("Error fetching data:", error);
					setListItems([]);
				};
			};
			getData();
		};
	}, [sourceFieldValue, url, formatResponse]);

	// Create a new list that includes a fallback option for a missing value
	const finalListItems = listItems.slice();

	if (value) {
		// Check if the currently selected value exists in the listItems
		const exists = listItems.some((item) => item.value === value);
		if (!exists) {
			let missingTitle = "Missing media item";
			try {
				const parsed = JSON.parse(value);
				missingTitle += ` ${parsed.mediaItemKey}`;
			} catch (error) {
				missingTitle += ` ${value}`;
			};
			finalListItems.push({ title: missingTitle, value: value });
		};
	};

	return renderDefault({
		...props,
		schemaType: { ...schemaType, options: { ...options, list: [{ title: "None", value: "" }, ...finalListItems] } },
	});
};