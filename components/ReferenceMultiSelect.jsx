import { useCallback, useEffect, useState } from "react"
import { PatchEvent, Preview, TextWithTone, set, useEditState, useTimeAgo } from "sanity"
import { usePaneRouter } from "sanity/desk"
import useSanityClient from "../sanity.client"
import { fromString as pathFromString } from "@sanity/util/paths"
import { randomKey } from "@sanity/util/content"
import { Box, Button, Card, Checkbox, Flex, Popover, Spinner, Text } from "@sanity/ui"
import { EditIcon, ErrorOutlineIcon, PublishIcon } from "@sanity/icons"

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
					{referenceMultiSelectWrapperFocusStyles}
					{referenceMultiSelectItemHoverStyles}
					{documentIds.map((documentId) => (
						<ReferenceMultiSelectItem
							documentId={documentId}
							errorOutlineIconProps={errorOutlineIconProps}
							key={documentId}
							layout={options?.layout || "default"}
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
		layout,
		members,
		onChange,
		schemaType,
		value,
	} = props
	const isAdded = value?.some((entry) => entry._ref === documentId)
	const errors = members?.filter((member) => member.item.value._ref === documentId)[0]?.item?.validation?.filter((validationItem) => validationItem.level === "error")
	const errorMessages = errors?.map((error) => error.message)
	const [isErrorOutlineIconPopoverOpen, setIsErrorOutlineIconPopoverOpen] = useState(false)
	const [isEditIconPopoverOpen, setIsEditIconPopoverOpen] = useState(false)
	const [isPublishIconPopoverOpen, setIsPublishIconPopoverOpen] = useState(false)
	const { routerPanesState, groupIndex, handleEditReference } = usePaneRouter()
	const document = useEditState(documentId)
	const editedTimeAgo = useTimeAgo(document?.draft?._updatedAt || "", { minimal: false, agoSuffix: true })
	const publishedTimeAgo = useTimeAgo(document?.published?._updatedAt || "", { minimal: false, agoSuffix: true })
	const handleEdit = useCallback((id, type) => {
		// https://github.com/sanity-io/sanity-plugin-documents-pane/blob/main/src/Documents.tsx
		// const childParams = routerPanesState[groupIndex + 1]?.[0].params || {}
		const childParams = routerPanesState[1]?.[0].params || {}
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
		setIsErrorOutlineIconPopoverOpen(true)
	}, [])
	const handleErrorOutlineIconHoverEnd = useCallback(() => {
		setIsErrorOutlineIconPopoverOpen(false)
	}, [])
	const handleEditIconHoverStart = useCallback(() => {
		setIsEditIconPopoverOpen(true)
	}, [])
	const handleEditIconHoverEnd = useCallback(() => {
		setIsEditIconPopoverOpen(false)
	}, [])
	const handlePublishIconHoverStart = useCallback(() => {
		setIsPublishIconPopoverOpen(true)
	}, [])
	const handlePublishIconHoverEnd = useCallback(() => {
		setIsPublishIconPopoverOpen(false)
	}, [])
	const isDraft = document?.draft
	const isPublished = document?.published
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
				gap={1}
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
						as={"a"}
						onClick={() => handleEdit(documentId, document._type)}
						padding={1}
						paddingLeft={1}
						mode={"bleed"}
						style={{
							display: "block",
							width: "100%",
							cursor: "pointer"
						}}
					>
						<Flex gap={1} align={"center"} justify={"center"}>
							<Box flex={1}>
								<Preview
									schemaType={schemaType.of[0].to[0]}
									value={document.draft || document.published}
									layout={layout}
								/>
							</Box>
							<Box padding={2}>
								<TextWithTone
									muted={isPublished ? false : true}
									tone={isPublished ? "positive" : null}
								>
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
										placement={"bottom"}
										open={isPublishIconPopoverOpen}
										tone="default"
										padding={2}
										shadow={1}
										radius={2}
										portal
									>
										<PublishIcon
											onMouseEnter={handlePublishIconHoverStart}
											onMouseLeave={handlePublishIconHoverEnd}
											style={{
												display: "block",
												width: "1.3125rem",
												height: "1.3125rem",
												marginBlock: "-0.0625rem",
												opacity: isPublished ? null : 0.3,
											}}
										/>
									</Popover>
								</TextWithTone>
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
													? (
														<>
															Edited {editedTimeAgo}
														</>
													)
													: "No unpublished edits"
												}
											</Text>
										}
										placement={"bottom"}
										open={isEditIconPopoverOpen}
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
								open={isErrorOutlineIconPopoverOpen}
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