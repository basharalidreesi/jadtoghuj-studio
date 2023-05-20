import { PatchEvent, set, useFormValue } from "sanity"
import { Box, Button, Flex, useToast } from "@sanity/ui"
import { useCallback, useState } from "react"

export default function TitleFromUrl(props) {
	const {
		onChange,
		path,
		renderDefault,
	} = props
	const [isFetching, setIsFetching] = useState(false)
	const toast = useToast()
	const key = path?.[1]?._key
	const url = useFormValue(["references"]).find((reference) => reference?._key === key)?.url
	const handleClick = useCallback(async () => {
		if (!url) { return }
		setIsFetching(true)
		// https://cors-anywhere.herokuapp.com/
		try {
			const response = await fetch(url).then(console.info("Fetching title."))
			const text = await response.text()
			const title = text?.match(/<title>(.*?)<\/title>/)?.[1]
			if (title) {
				const intermediateDocument = new DOMParser().parseFromString(title, "text/html")
				const textContent = intermediateDocument.documentElement.textContent
				onChange(PatchEvent.from(set(textContent)))
				toast.push({
					status: "success",
					title: "Success",
					closable: true,
				})
			} else {
				toast.push({
					status: "error",
					title: "Title not found",
					closable: true,
				})
			}
			setIsFetching(false)
		} catch (error) {
			setIsFetching(false)
			console.error(error)
			toast.push({
				status: "error",
				title: "URL could not be reached",
				closable: true,
			})
		}
	}, [url])
	return (
		<Flex gap={1}>
			<Box flex={1}>
				{renderDefault(props)}
			</Box>
			<Box>
				<Button
					mode={"ghost"}
					padding={3}
					text={"Generate"}
					onClick={handleClick}
					disabled={isFetching}
				/>
			</Box>
		</Flex>
	)
}