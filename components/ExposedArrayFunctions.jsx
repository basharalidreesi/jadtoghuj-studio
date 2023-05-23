import { useCallback } from "react"
import { ArrayOfPrimitivesFunctions } from "sanity"
import { Box, Button, Grid } from "@sanity/ui"
import { AddIcon } from "@sanity/icons"

export default function ExposedArrayFunctions(props) {
	return props.renderDefault({...props, arrayFunctions: ArrayFunctions})
}

function ArrayFunctions(props) {
	const handleAdd = useCallback((type) => {
		props.onItemAppend({"_type": `${type}`})
	}, [props])
	const resolvePermittedTypes = () => props.schemaType.of.filter((type) => {
		const typeName = type.name
		const typeConstraints = type.options?.exposedArrayConstraints
		if (!typeConstraints) { return true }
		const typePassesIncludeInExposedArray = () => {
			const includeInExposedArray = typeConstraints.includeInExposedArray
			if (props.schemaType.of.length > 1 && includeInExposedArray === false) {
				return false
			}
			return true
		}
		const typePassesMaxInstances = () => {
			const maxInstances = typeConstraints.maxInstances
			if (!maxInstances) { return true }
			const instancesFound = props.value.filter((item) => item._type === typeName).length
			if (instancesFound >= maxInstances) { return false }
			return true
		}
		return typePassesIncludeInExposedArray() && typePassesMaxInstances() ? true : false
	})
	const permittedTypes = resolvePermittedTypes()
	return (
		<Grid columns={permittedTypes.length} gap={3}>
			{permittedTypes.map((type) => (
				<Button
					key={type.name}
					icon={permittedTypes.length > 1 && type.icon ? type.icon : AddIcon}
					text={"Add " + type.title}
					mode={"ghost"}
					onClick={() => handleAdd(type.name)}
				/>
			))}
			{props.schemaType.options?.exposedArrayOptions
				? (
					<Box style={{ gridColumn: "1/-1" }}>
						<ArrayOfPrimitivesFunctions {...props} />
					</Box>
				)
				: ""
			}
		</Grid>
	)
}