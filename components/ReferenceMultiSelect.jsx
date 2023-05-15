import { useCallback, useEffect, useState } from "react"
import { PatchEvent, Preview, TextWithTone, set } from "sanity"
import { usePaneRouter } from "sanity/desk"
import useSanityClient from "../sanity.client"
import { fromString as pathFromString } from "@sanity/util/paths"
import { randomKey } from "@sanity/util/content"
import { Box, Button, Card, Checkbox, Flex, Popover, Spinner, Text } from "@sanity/ui"
import { EditIcon, ErrorOutlineIcon } from "@sanity/icons"

export default function ReferenceMultiSelect(props) {
	const {
		members,
		onChange,
		options,
		schemaType,
		value,
	} = props
	const [documentIds, setDocumentIds] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [hasLoaded, setHasLoaded] = useState(false)
	const client = useSanityClient()
	useEffect(() => {
		async function getDocumentIds() {
			try {
				setIsFetching(true)
				setHasError(false)
				const documentIds = await client.fetch(options?.query, options?.params).then(console.info("Fetching document ids for reference multi-select."))
				setDocumentIds(documentIds.filter((id) => !id.startsWith("drafts.")))
				setIsFetching(false)
				setHasLoaded(true)
			} catch {
				setIsFetching(false)
				setHasError(true)
				setHasLoaded(false)
			}
		}
		getDocumentIds()
	}, [value])
	const referenceMultiSelectWithItemsWrapperProps = {
		className: "jt-reference-multi-select-wrapper",
		tabIndex: 0,
		radius: 1,
		border: true,
	}
	const referenceMultiSelectWithoutItemsWrapperProps = {
		className: "jt-reference-multi-select-wrapper",
		tabIndex: 0,
		padding: 3,
		radius: 2,
		border: true,
		style: {
			borderStyle: "dashed",
		},
	}
	const referenceMultiSelectWrapperFocusStyles = (
		<style>{`
			.jt-reference-multi-select-wrapper:focus {
				box-shadow: inset 0 0 0 0px var(--card-border-color),0 0 0 1px var(--card-bg-color),0 0 0 3px var(--card-focus-ring-color);
			}
		`}</style>
	)
	const referenceMultiSelectItemHoverStyles = (
		<style>{`
			.jt-reference-multi-select-item {
				transition: border 0.5s;
			}
			.jt-reference-multi-select-item:not(:hover) {
				border-color: transparent;
			}
			.jt-reference-multi-select-item:hover {
				border-color: var(--card-shadow-umbra-color);
			}
		`}</style>
	)
	const errorOutlineIconProps = {
		style: {
			display: "block",
			margin: "auto",
			width: "1.5rem",
			height: "1.5rem",
			marginBlock: "-0.4rem",
		},
	}
	if ((isFetching || hasError) && !hasLoaded) {
		if (isFetching) {
			return (
				<Card {...referenceMultiSelectWithoutItemsWrapperProps}>
					{referenceMultiSelectWrapperFocusStyles}
					<Flex align={"center"} justify={"center"}>
						<Spinner muted />
					</Flex>
				</Card>
			)
		}
		if (hasError) {
			return (
				<Card {...referenceMultiSelectWithoutItemsWrapperProps} tone={"critical"}>
					{referenceMultiSelectWrapperFocusStyles}
					<Flex align={"center"} justify={"center"}>
						<ErrorOutlineIcon {...errorOutlineIconProps} />
					</Flex>
				</Card>
			)
		}
	}
	if ((!isFetching && !hasError) || hasLoaded) {
		if (documentIds.length === 0) {
			return (
				<Card {...referenceMultiSelectWithoutItemsWrapperProps}>
					{referenceMultiSelectWrapperFocusStyles}
					<Text muted size={1} align={"center"} style={{ marginBlock: "0.0625rem" }}>
						No items
					</Text>
				</Card>
			)
		}
		if (documentIds.length > 0) {
			return (
				<Card {...referenceMultiSelectWithItemsWrapperProps}>
					{referenceMultiSelectItemHoverStyles}
					{referenceMultiSelectWrapperFocusStyles}
					{documentIds.map((documentId) => (
						<ReferenceMultiSelectItem
							documentId={documentId}
							errorOutlineIconProps={errorOutlineIconProps}
							key={documentId}
							members={members}
							onChange={onChange}
							schemaType={schemaType}
							value={value}
						/>
					))}
				</Card>
			)
		}
	}
}

function ReferenceMultiSelectItem(props) {
	const {
		documentId,
		errorOutlineIconProps,
		members,
		onChange,
		schemaType,
		value,
	} = props
	const isAdded = value?.some((entry) => entry._ref === documentId)
	const errors = members?.filter((member) => member.item.value._ref === documentId)[0]?.item?.validation?.filter((validationItem) => validationItem.level === "error")
	const errorMessages = errors?.map((error) => error.message)
	const [publishedDocument, setPublishedDocument] = useState(null)
	const [draftDocument, setDraftDocument] = useState(null)
	const [currentDocument, setCurrentDocument] = useState(publishedDocument)
	const [isErrorOutlineIconPopOverOpen, setIsErrorOutlineIconPopOverOpen] = useState(false)
	const [isEditIconPopOverOpen, setIsEditIconPopOverOpen] = useState(false)
	const { routerPanesState, groupIndex, handleEditReference } = usePaneRouter()
	const client = useSanityClient()
	const handleEdit = useCallback((id, type) => {
		// https://github.com/sanity-io/sanity-plugin-documents-pane/blob/main/src/Documents.tsx
		const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
		const { parentRefPath } = childParams
		return handleEditReference({
			id,
			type,
			parentRefPath: parentRefPath ? pathFromString(parentRefPath) : [``],
			template: { id },
		})
	}, [routerPanesState, groupIndex, handleEditReference])
	const handleAdd = useCallback((event) => {
		// https://www.sanity.io/schemas/v3-version-of-display-an-array-of-references-as-a-checklist-ecfa271a
		const inputValue = {
			_key: randomKey(12),
			_type: "reference",
			_ref: event.target.value,
		}
		if (value) {
			if (value.some((document) => document._ref === inputValue._ref)) {
				onChange(PatchEvent.from(set(value.filter((entry) => entry._ref !== inputValue._ref))))
			} else {
				onChange(PatchEvent.from(set([...value, inputValue])))
			}
		} else {
			onChange(PatchEvent.from(set([inputValue])))
		}
	}, [value])
	const handleErrorOutlineIconHoverStart = useCallback(() => {
		setIsErrorOutlineIconPopOverOpen(true)
	}, [])
	const handleErrorOutlineIconHoverEnd = useCallback(() => {
		setIsErrorOutlineIconPopOverOpen(false)
	}, [])
	const handleEditIconHoverStart = useCallback(() => {
		setIsEditIconPopOverOpen(true)
	}, [])
	const handleEditIconHoverEnd = useCallback(() => {
		setIsEditIconPopOverOpen(false)
	}, [])
	const timeAgo = (prevDate) => {
		// https://stackoverflow.com/a/58918815
		const diff = Number(new Date()) - prevDate
		const minute = 60 * 1000
		const hour = minute * 60
		const day = hour * 24
		const month = day * 30
		const year = day * 365
		switch (true) {
			case diff < minute:
				return "just now"
			case diff < hour:
				return Math.round(diff / minute) + " minutes ago"
			case diff < day:
				return Math.round(diff / hour) + " hours ago"
			case diff < month:
				return Math.round(diff / day) + " days ago"
			case diff < year:
				return Math.round(diff / month) + " months ago"
			case diff > year:
				return Math.round(diff / year) + " years ago"
			default:
				return ""
		}
	}
	useEffect(() => {
		async function getDocument() {
			await client.fetch(`*[_id == $id][0]`, { id: documentId }).then(setPublishedDocument).then(console.info("Fetching published document for reference multi-select."))
			await client.fetch(`*[_id == "drafts." + $id][0]`, { id: documentId }).then(setDraftDocument).then(console.info("Fetching draft document for reference multi-select."))
			client.listen(`*[_id == "drafts." + $id][0]`, { id: documentId }).subscribe((update) => {
				console.info("Listening to document changes for reference multi-select.")
				const document = update.result
				if (!document) {
					setDraftDocument(null)
				}
				setCurrentDocument(document)
			})
		}
		getDocument()
	}, [documentId])
	const isDraft = draftDocument || (currentDocument && currentDocument._id?.startsWith("drafts."))
	return (
		<Card
			className={"jt-reference-multi-select-item"}
			padding={1}
			margin={1}
			radius={2}
			border={true}
			tone={errors?.length > 0 ? "critical" : (isAdded ? "transparent" : "default")}
		>
			<Flex
				align={"center"}
				justify={"center"}
			>
				<Box
					padding={2}
				>
					<Checkbox
						onClick={handleAdd}
						onChange={() => {}}
						value={documentId}
						checked={value ? isAdded : false}
						style={{ display: "block", width: "auto" }}
					/>
				</Box>
				<Box
					flex={1}
				>
					<Button
						onClick={() => handleEdit(documentId, document._type)}
						padding={1}
						paddingLeft={1}
						mode={"bleed"}
						style={{ display: "block", width: "100%" }}
					>
						<Flex gap={1} align={"center"} justify={"center"}>
							<Box flex={1}>
								<Preview
									schemaType={schemaType.of[0].to[0]}
									value={currentDocument || draftDocument || publishedDocument}
									layout="default"
								/>
							</Box>
							<Box padding={2}>
								<TextWithTone
									muted={isDraft ? false : true}
									tone={isDraft ? "caution" : null}
								>
									<Popover
										content={
											<Text size={1}>
												{isDraft
													? `Edited ${
														timeAgo(new Date(currentDocument?._updatedAt)?.getTime())
														|| timeAgo(new Date(draftDocument?._updatedAt)?.getTime())
														|| timeAgo(new Date(publishedDocument?._updatedAt)?.getTime())
													}`
													: "No unpublished edits"
												}
											</Text>
										}
										placement={"bottom"}
										open={isEditIconPopOverOpen}
										tone="default"
										padding={2}
										shadow={1}
										radius={2}
										portal
									>
										<EditIcon
											onMouseEnter={handleEditIconHoverStart}
											onMouseLeave={handleEditIconHoverEnd}
											style={{
												display: "block",
												width: "1.3125rem",
												height: "1.3125rem",
												marginBlock: "-0.0625rem",
												opacity: isDraft ? null : 0.3,
											}}
										/>
									</Popover>
								</TextWithTone>
							</Box>
						</Flex>
					</Button>
				</Box>
				{errors?.length > 0
					? (
						<Box
							key={documentId}
							paddingLeft={2}
							paddingRight={1}
						>
							<Popover
								content={
									errorMessages.map((message, index) => (
										<Text key={index} size={1} muted><ErrorOutlineIcon color="rgb(240, 62, 47)" style={{ paddingRight: "0.5rem" }} />{message}</Text>
									))
								}
								placement={"top"}
								open={isErrorOutlineIconPopOverOpen}
								tone={"default"}
								padding={3}
								shadow={1}
								radius={2}
								portal
							>
								<ErrorOutlineIcon {...errorOutlineIconProps} onMouseEnter={handleErrorOutlineIconHoverStart} onMouseLeave={handleErrorOutlineIconHoverEnd} color={"rgb(240, 62, 47)"} />
							</Popover>
						</Box>
					)
					: ""
				}
			</Flex>
		</Card>
	)
}