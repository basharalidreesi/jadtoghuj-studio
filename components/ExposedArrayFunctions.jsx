import { useCallback } from "react"
import { AddIcon } from "@sanity/icons"
import { Button, Grid } from "@sanity/ui"

// TODO

export default function ExposedArrayFunctions(props) {
	return props.renderDefault({...props, arrayFunctions: ArrayFunctions})
}

function ArrayFunctions(props) {
	const handleAdd = useCallback((type) => {
		props.onItemAppend({"_type": `${type}`})
	}, [props])
	return (
		<Grid columns={props.schemaType.of.length < 3 ? props.schemaType.of.length : Math.ceil(props.schemaType.of.length / 2)} gap={3}>
			{props.schemaType.of.map(type => (
				<Button
					key={type.name}
					icon={AddIcon}
					text={"Add " + type.title}
					mode="ghost"
					onClick={() => handleAdd(type.name)}
				/>
			))}
			{/* <ArrayOfPrimitivesFunctions {...props} /> */}
		</Grid>
	)
}