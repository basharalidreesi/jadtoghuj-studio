
import { set, StringInputProps } from "sanity";
import { useCallback } from "react";
import { Button, Grid } from "@sanity/ui";

export const StringListInput = (props: StringInputProps) => {
	const {
		value,
		onChange,
		schemaType,
		renderDefault,
	} = props;

	const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const nextValue = event.currentTarget.value
		onChange(set(nextValue))
	}, [onChange]);

	const list = schemaType.options?.list;
	
	return list && list.length > 0 ? (
		<Grid columns={list.length} gap={2}>
			{list.map((listItem) => (
				<Button
					// @ts-ignore
					key={listItem.value}
					// @ts-ignore
					mode={value === listItem.value ? "default" : "ghost"}
					// @ts-ignore
					tone={value === listItem.value ? "primary" : "default"}
					// @ts-ignore
					text={listItem.title}
					// @ts-ignore
					value={listItem.value}
					onClick={handleClick}
				/>
			))}
		</Grid>
	) : renderDefault(props);
};