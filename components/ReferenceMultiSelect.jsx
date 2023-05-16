import { useCallback, useEffect, useState } from "react"
import { PatchEvent, Preview, TextWithTone, set, useEditState, useTimeAgo } from "sanity"
import { usePaneRouter } from "sanity/desk"
import useSanityClient from "../sanity.client"
import { randomKey } from "@sanity/util/content"
import { uuid } from "@sanity/uuid"
import { Box, Button, Card, Checkbox, Flex, Popover, Spinner, Text } from "@sanity/ui"
import { EditIcon, ErrorOutlineIcon, PublishIcon } from "@sanity/icons"
import { useTheme } from "styled-components"

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
	const [hasCreatedNew, setHasCreatedNew] = useState(false)
	const client = useSanityClient()
	// const handleCreateNew = useCallback(() => {
	// 	const newDocument = {
	// 		_id: `drafts.${uuid()}`,
	// 		_type: schemaType?.of[0]?.to[0]?.name,
	// 	}
	// 	client.create(newDocument).then((document) => {
	// 		setHasCreatedNew(true)
	// 		console.log("Created document with id " + document._id)
	// 	})
	// 	setHasCreatedNew(false)
	// }, [value])
	useEffect(() => {
		async function getDocumentIds() {
			try {
				setIsFetching(true)
				setHasError(false)
				const documentIds = await client.fetch(options?.query, options?.params).then(console.info("Fetching document ids for reference multi-select."))
				setDocumentIds(documentIds.filter((documentId) => !documentId.startsWith("drafts.")))
				setIsFetching(false)
				setHasLoaded(true)
			} catch {
				setIsFetching(false)
				setHasError(true)
				setHasLoaded(false)
			}
		}
		getDocumentIds()
	}, [value, hasCreatedNew])
	const referenceMultiSelectWrapperWithItemsProps = {
		className: "jt-reference-multi-select-wrapper",
		tabIndex: 0,
		radius: 1,
		border: true,
	}
	const referenceMultiSelectWrapperWithoutItemsProps = {
		className: "jt-reference-multi-select-wrapper",
		tabIndex: 0,
		padding: 3,
		radius: 2,
		border: true,
		style: {
			borderStyle: "dashed",
		},
	}
	const ReferenceMultiSelectWrapperFocusStyles = () => (
		<style>{`
			.jt-reference-multi-select-wrapper:focus {
				box-shadow: inset 0 0 0 0px var(--card-border-color),0 0 0 1px var(--card-bg-color),0 0 0 3px var(--card-focus-ring-color);
			}
		`}</style>
	)
	const ReferenceMultiSelectItemHoverStyles = () => (
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
	if ((isFetching || hasError) && !hasLoaded) {
		if (isFetching) {
			return (
				<Card {...referenceMultiSelectWrapperWithoutItemsProps}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<Flex align={"center"} justify={"center"}>
						<Spinner muted />
					</Flex>
				</Card>
			)
		}
		if (hasError) {
			return (
				<Card {...referenceMultiSelectWrapperWithoutItemsProps} tone={"critical"}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<Flex align={"center"} justify={"center"}>
						<ErrorOutlineIcon {...getErrorOutlineIconProps({ layout: "block", withColour: false })} />
					</Flex>
				</Card>
			)
		}
	}
	if ((!isFetching && !hasError) || hasLoaded) {
		if (documentIds.length === 0) {
			return (
				<Card {...referenceMultiSelectWrapperWithoutItemsProps}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<Text muted size={1} align={"center"} style={{ marginBlock: "0.0625rem" }}>
						No items
					</Text>
				</Card>
			)
		}
		if (documentIds.length > 0) {
			return (
				<Card {...referenceMultiSelectWrapperWithItemsProps}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<ReferenceMultiSelectItemHoverStyles />
					{documentIds.map((documentId) => (
						<ReferenceMultiSelectItem
							key={documentId}
							documentId={documentId}
							item={members?.filter((member) => member?.item?.value?._ref === documentId)[0]?.item}
							layout={options?.layout || "default"}
							onChange={onChange}
							schemaType={schemaType}
							value={value}
						/>
					))}
					{/* <Button onClick={handleCreateNew}>Create new</Button> */}
				</Card>
			)
		}
	}
}

function ReferenceMultiSelectItem(props) {
	const {
		documentId,
		item,
		layout,
		onChange,
		schemaType,
		value,
	} = props
	const isAdded = value?.some((entry) => entry._ref === documentId)
	const errors = item?.validation?.filter((validationItem) => validationItem.level === "error")
	const errorMessages = errors?.map((error) => error.message)
	// const [hasChanged, setHasChanged] = useState(item?.changed)
	const [isPublishIconPopoverOpen, setIsPublishIconPopoverOpen] = useState(false)
	const [isEditIconPopoverOpen, setIsEditIconPopoverOpen] = useState(false)
	const [isErrorOutlineIconPopoverOpen, setIsErrorOutlineIconPopoverOpen] = useState(false)
	const { sanity } = useTheme()
	const { routerPanesState, ReferenceChildLink } = usePaneRouter()
	const preview = useEditState(documentId)
	const editedTimeAgo = useTimeAgo(preview?.draft?._updatedAt || "", { minimal: false, agoSuffix: true })
	const publishedTimeAgo = useTimeAgo(preview?.published?._updatedAt || "", { minimal: false, agoSuffix: true })
	const handleCheck = useCallback((event) => {
		// https://www.sanity.io/schemas/v3-version-of-display-an-array-of-references-as-a-checklist-ecfa271a
		const inputValue = {
			_key: randomKey(12),
			_type: "reference",
			_ref: event.target.value,
		}
		if (value) {
			if (value.some((item) => item._ref === inputValue._ref)) {
				// remove
				onChange(PatchEvent.from(set(value.filter((entry) => entry._ref !== inputValue._ref))))
			} else {
				// add
				onChange(PatchEvent.from(set([...value, inputValue])))
			}
		} else {
			// set if missing
			onChange(PatchEvent.from(set([inputValue])))
		}
	}, [value])
	const handlePublishIconHoverStart = useCallback(() => {
		setIsPublishIconPopoverOpen(true)
	}, [])
	const handlePublishIconHoverEnd = useCallback(() => {
		setIsPublishIconPopoverOpen(false)
	}, [])
	const handleEditIconHoverStart = useCallback(() => {
		setIsEditIconPopoverOpen(true)
	}, [])
	const handleEditIconHoverEnd = useCallback(() => {
		setIsEditIconPopoverOpen(false)
	}, [])
	const handleErrorOutlineIconHoverStart = useCallback(() => {
		setIsErrorOutlineIconPopoverOpen(true)
	}, [])
	const handleErrorOutlineIconHoverEnd = useCallback(() => {
		setIsErrorOutlineIconPopoverOpen(false)
	}, [])
	const isDraft = preview?.draft
	const isPublished = preview?.published
	const documentType = preview?.draft?._type || preview?.published?._type
	const itemId = item?.id
	const parentRefPath = routerPanesState[routerPanesState?.length - 1][0]?.params?.parentRefPath
	const isSelected = (parentRefPath && parentRefPath === itemId) || routerPanesState[routerPanesState?.length - 1][0]?.id === documentId
	return (
		<Card
			className={"jt-reference-multi-select-item"}
			padding={1}
			margin={1}
			radius={2}
			border={true}
			tone={errors?.length > 0 ? "critical" : (value && isAdded ? "transparent" : "default")}
		>
			<Flex align={"center"} justify={"center"} gap={1}>
				<Box padding={2}>
					<Checkbox
						onClick={handleCheck}
						onChange={() => {}}
						value={documentId}
						checked={value ? isAdded : false}
						style={{ display: "block", width: "auto" }}
					/>
				</Box>
				<Box flex={1}>
					<ReferenceChildLink
						documentId={documentId}
						documentType={documentType}
						parentRefPath={itemId ? [itemId] : []}
						style={{
							all: "unset",
							cursor: "pointer",
						}}
					>
						<Button
							as={"div"}
							padding={1}
							mode={isSelected ? "default" : "bleed"}
							tone={isSelected ? "primary" : "default" }
							style={{
								display: "block",
								width: "100%",
								"--card-fg-color": isSelected ? sanity?.color?.base?.bg : null,
								"--card-bg-color": isSelected ? sanity?.color?.solid?.primary?.enabled?.bg : null,
								"--card-border-color": isSelected ? sanity?.color?.solid?.primary?.enabled?.bg : null,
							}}
						>
							<Flex gap={1} align={"center"} justify={"center"}>
								<Box flex={1}>
									<Preview
										schemaType={schemaType?.of[0]?.to[0]}
										value={preview?.draft || preview?.published}
										layout={layout}
									/>
								</Box>
								<Box padding={2}>
									<TextWithTone {...getPublishOrEditIconTextWithToneProps({ state: isPublished, ifTrue: "positive" })}>
										<Popover
											content={
												<Text size={1}>
													{isPublished
														? (
															<>
																Published {publishedTimeAgo}
															</>
														)
														: "Not published"
													}
												</Text>
											}
											{...getPublishOrEditIconPopoverProps({ handler: isPublishIconPopoverOpen })}
										>
											<PublishIcon
												onMouseEnter={handlePublishIconHoverStart}
												onMouseLeave={handlePublishIconHoverEnd}
												{...getPublishOrEditIconProps({ state: isPublished, isSelected: isSelected, ifSelected: sanity?.color?.base?.bg })}
											/>
										</Popover>
									</TextWithTone>
								</Box>
								<Box padding={2}>
									<TextWithTone {...getPublishOrEditIconTextWithToneProps({ state: isDraft, ifTrue: "caution" })}>
										<Popover
											content={
												<Text size={1}>
													{isDraft
														? (
															<>
																Edited {editedTimeAgo}
															</>
														)
														: "No unpublished edits"
													}
												</Text>
											}
											{...getPublishOrEditIconPopoverProps({ handler: isEditIconPopoverOpen })}
										>
											<EditIcon
												onMouseEnter={handleEditIconHoverStart}
												onMouseLeave={handleEditIconHoverEnd}
												{...getPublishOrEditIconProps({ state: isDraft, isSelected: isSelected, ifSelected: sanity?.color?.base?.bg })}
											/>
										</Popover>
									</TextWithTone>
								</Box>
							</Flex>
						</Button>
					</ReferenceChildLink>
				</Box>
				{errors?.length > 0
					? (
						<Box padding={1}>
							<Popover
								content={
									errorMessages.map((message, index) => (
										<Text key={index} size={1} muted>
											<ErrorOutlineIcon {...getErrorOutlineIconProps({ layout: "inline", withColour: true })} />
											{message}
										</Text>
									))
								}
								{...getErrorOutlineIconPopoverProps({ handler: isErrorOutlineIconPopoverOpen })}
							>
								<ErrorOutlineIcon
									onMouseEnter={handleErrorOutlineIconHoverStart}
									onMouseLeave={handleErrorOutlineIconHoverEnd}
									{...getErrorOutlineIconProps({ layout: "block", withColour: true })}
								/>
							</Popover>
						</Box>
					)
					: ""
				}
			</Flex>
		</Card>
	)
}

function getPublishOrEditIconTextWithToneProps(params = {}) {
	const {
		state = false,
		ifTrue = null,
	} = params
	return {
		muted: state ? false : true,
		tone: state ? ifTrue : null,
	}
}

function getPublishOrEditIconPopoverProps(params = {}) {
	const {
		handler = null,
	} = params
	return {
		placement: "bottom",
		tone: "default",
		padding: 2,
		radius: 2,
		shadow: 1,
		open: handler,
		portal: true,
	}
}

function getPublishOrEditIconProps(params = {}) {
	const {
		state = false,
		isSelected = false,
		ifSelected = null,
	} = params
	return {
		style: {
			display: "block",
			width: "1.3125rem",
			height: "1.3125rem",
			marginBlock: "-0.0625rem",
			opacity: state ? null : 0.3,
			color: isSelected ? ifSelected : null,
		},
	}
}

function getErrorOutlineIconPopoverProps(params = {}) {
	const {
		handler = null
	} = params
	return {
		placement: "top",
		tone: "default",
		padding: 3,
		radius: 2,
		shadow: 1,
		open: handler,
		portal: true,
	}
}

function getErrorOutlineIconProps(params = {}) {
	const {
		layout = "block",
		withColour = false,
	} = params
	function resolveStyles() {
		if (layout === "block") {
			return {
				display: "block",
				margin: "auto",
				width: "1.5rem",
				height: "1.5rem",
				marginBlock: "-0.4rem",
			}
		}
		if (layout === "inline") {
			return {
				paddingRight: "0.5rem",
			}
		}
	}
	return {
		style: resolveStyles(),
		color: withColour ? "rgb(240, 62, 47)" : null,
	}
}