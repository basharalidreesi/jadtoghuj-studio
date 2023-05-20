import { useCallback, useEffect, useState } from "react"
import { ChangeIndicator, FieldPresenceInner, FormFieldValidationStatus, PatchEvent, Preview, TextWithTone, getPublishedId, set, useDocumentOperationEvent, useDocumentPresence, useEditState, useTimeAgo } from "sanity"
import { usePaneRouter } from "sanity/desk"
import useSanityClient from "../sanity.client"
import { randomKey } from "@sanity/util/content"
import { Box, Button, Card, Checkbox, Flex, Grid, Popover, Spinner, Text } from "@sanity/ui"
import { AddIcon, EditIcon, ErrorOutlineIcon, PublishIcon } from "@sanity/icons"
import { useTheme } from "styled-components"
import { uuid } from "@sanity/uuid"

export default function ReferenceMultiSelect(props) {
	const {
		elementProps,
		members,
		onChange,
		options,
		schemaType,
		renderPreview,
		value,
	} = props
	const [documentIds, setDocumentIds] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [hasLoaded, setHasLoaded] = useState(false)
	const client = useSanityClient()
	const { routerPanesState, groupIndex, handleEditReference } = usePaneRouter()
	const handleCreateNew = useCallback(() => {
		const documentId = uuid()
		const documentType = schemaType?.of[0]?.to[0]?.name
		const inputValue = {
			_key: randomKey(12),
			_type: "reference",
			_ref: documentId,
			_weak: true,
			_strengthenOnPublish: {
				type: documentType,
				template: {
					id: documentType,
				},
			},
		}
		if (value && value.length >= 1) {
			// add
			onChange(PatchEvent.from(set([...value, inputValue])))
		} else {
			// initial set
			onChange(PatchEvent.from(set([inputValue])))
		}
		const itemId = members?.filter((member) => member?.item?.value?._ref === documentId)[0]?.item?.id
		handleEditReference({
			id: documentId,
			type: documentType,
			template: documentType,
			parentRefPath: itemId ? [itemId] : [],
		})
	}, [value])
	useEffect(() => {
		async function getDocumentIds() {
			try {
				setIsFetching(true)
				setHasError(false)
				const documentIds = await client.fetch(options?.query, options?.params).then(console.info("Fetching document ids for reference multi-select."))
				const alreadyReferencedDocumentIds = value ? value?.map((item) => item._ref) : [null]
				const documentInPaneRouterDocumentId =
					routerPanesState[groupIndex + 1]?.[0]?.id
					&& routerPanesState[groupIndex + 1]?.[0]?.params?.type === schemaType?.of[0]?.to[0]?.name
					? routerPanesState[groupIndex + 1]?.[0]?.id
					: null
				setDocumentIds([...new Set([...documentIds?.map((documentId) => getPublishedId(documentId)), ...alreadyReferencedDocumentIds, documentInPaneRouterDocumentId].filter(Boolean))])
				setIsFetching(false)
				setHasLoaded(true)
			} catch (error) {
				setIsFetching(false)
				setHasError(true)
				setHasLoaded(false)
				console.error(error)
			}
		}
		getDocumentIds()
	}, [value, routerPanesState])
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
	const ReferenceMultiSelectItemChangeIndicatorStyles = () => (
		<style>{`
			.jt-reference-multi-select-item-change-indicator-wrapper * {
				height: 100%;
			}
		`}</style>
	)
	function CreateNewButton(props = {}) {
		const {} = props
		return (
			<Box>
				<Button
					icon={AddIcon}
					mode="ghost"
					padding={3}
					text="Create new"
					onClick={handleCreateNew}
					style={{
						width: "100%",
					}}
				/>
			</Box>
		)
	}
	if ((isFetching || hasError) && !hasLoaded) {
		if (isFetching) {
			return (
				<Card {...referenceMultiSelectWrapperWithoutItemsProps} {...elementProps}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<Flex align={"center"} justify={"center"}>
						<Spinner muted />
					</Flex>
				</Card>
			)
		}
		if (hasError) {
			return (
				<Card tone={"critical"} {...referenceMultiSelectWrapperWithoutItemsProps} {...elementProps}>
					<ReferenceMultiSelectWrapperFocusStyles />
					<Flex align={"center"} justify={"center"}>
						<ErrorOutlineIcon style={{
							display: "block",
							margin: "auto",
							width: "1.5rem",
							height: "1.5rem",
							marginBlock: "-0.4rem",
						}} />
					</Flex>
				</Card>
			)
		}
	}
	if ((!isFetching && !hasError) || hasLoaded) {
		if (documentIds.length === 0) {
			return (
				<Grid columns={1} gap={3}>
					<Card {...referenceMultiSelectWrapperWithoutItemsProps} {...elementProps}>
						<ReferenceMultiSelectWrapperFocusStyles />
						<Text muted size={1} align={"center"} style={{ marginBlock: "0.0625rem" }}>
							No items
						</Text>
					</Card>
					{!schemaType?.of[0]?.options?.disableNew ? <CreateNewButton /> : ""}
				</Grid>
			)
		}
		if (documentIds.length > 0) {
			return (
				<Grid columns={1} gap={3}>
					<Card {...referenceMultiSelectWrapperWithItemsProps} {...elementProps}>
						<ReferenceMultiSelectWrapperFocusStyles />
						<ReferenceMultiSelectItemHoverStyles />
						<ReferenceMultiSelectItemChangeIndicatorStyles />
						{documentIds.map((documentId) => (
							<ReferenceMultiSelectItem
								key={documentId}
								documentId={documentId}
								item={members?.filter((member) => member?.item?.value?._ref === documentId)?.[0]?.item}
								layout={options?.layout || "default"}
								onChange={onChange}
								renderPreview={renderPreview}
								schemaType={schemaType}
								value={value}
							/>
						))}
					</Card>
					{!schemaType?.of[0]?.options?.disableNew ? <CreateNewButton /> : ""}
				</Grid>
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
		renderPreview,
		value,
	} = props
	const [isPublishIconPopoverOpen, setIsPublishIconPopoverOpen] = useState(false)
	const [isEditIconPopoverOpen, setIsEditIconPopoverOpen] = useState(false)
	const { routerPanesState, ReferenceChildLink } = usePaneRouter()
	const preview = useEditState(documentId)
	const documentOperationEvent = useDocumentOperationEvent(documentId, schemaType?.of[0]?.to[0]?.name)
	const documentPresence = useDocumentPresence(documentId)
	const editedTimeAgo = useTimeAgo(preview?.draft?._updatedAt || "", { minimal: false, agoSuffix: true })
	const publishedTimeAgo = useTimeAgo(preview?.published?._updatedAt || "", { minimal: false, agoSuffix: true })
	const { sanity } = useTheme()
	const isAdded = value?.some((entry) => entry._ref === documentId)
	const hasError = item?.validation?.some((validationItem) => validationItem.level === "error")
	const isDraft = preview?.draft
	const isPublished = preview?.published
	const documentType = schemaType?.of[0]?.to[0]?.name
	const itemId = item?.id
	const parentRefPath = routerPanesState[routerPanesState?.length - 1]?.[0]?.params?.parentRefPath
	const isSelected = (parentRefPath && parentRefPath === itemId) || routerPanesState[routerPanesState?.length - 1]?.[0]?.id === documentId
	const handleAdd = useCallback((event) => {
		// https://www.sanity.io/schemas/v3-version-of-display-an-array-of-references-as-a-checklist-ecfa271a
		const inputValue = {
			_key: randomKey(12),
			_type: "reference",
			_ref: event.target.value,
			_weak: true,
			_strengthenOnPublish: {
				type: documentType,
				template: {
					id: documentType,
				},
			},
		}
		if (value) {
			if (value.some((item) => item._ref === inputValue._ref)) {
				if (value.length <= 1) {
					// set to empty array if last one (to prevent undefined and trigger a value change)
					onChange(PatchEvent.from(set([])))
				} else {
					// remove
					onChange(PatchEvent.from(set(value.filter((entry) => entry._ref !== inputValue._ref))))
				}
			} else {
				// add
				onChange(PatchEvent.from(set([...value, inputValue])))
			}
		} else {
			// initial set
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
	useEffect(() => {
		if (
			documentOperationEvent?.op === "delete"
			&& documentOperationEvent?.type === "success"
			&& documentOperationEvent?.id === documentId
			&& !isSelected
			&& !isAdded
		) {
			if (value && value.length > 1) {
				// remove
				onChange(PatchEvent.from(set(value.filter((entry) => entry?._ref !== documentId))))
			} else {
				// unset
				onChange(PatchEvent.from(set([])))
			}
		}
	}, [documentOperationEvent, routerPanesState])
	return (
		<Card
			className={"jt-reference-multi-select-item"}
			padding={1}
			margin={1}
			radius={2}
			border={true}
			tone={hasError ? "critical" : (value && isAdded ? "transparent" : "default")}
			style={{
				position: "relative",
			}}
		>
			<Flex align={"center"} justify={"center"} gap={1}>
				<Box padding={2}>
					<Checkbox
						onClick={handleAdd}
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
							tone={isSelected ? (hasError ? "critical" : "primary") : "default" }
							style={{
								display: "block",
								width: "100%",
								"--card-fg-color": isSelected ? (hasError ? sanity?.color?.solid?.critical?.enabled?.accent?.fg : sanity?.color?.base?.bg) : null,
								"--card-bg-color": isSelected ? (hasError ? sanity?.color?.solid?.critical?.enabled?.bg : sanity?.color?.solid?.primary?.enabled?.bg) : null,
								"--card-border-color": isSelected ? (hasError ? sanity?.color?.solid?.critical?.enabled?.bg : sanity?.color?.solid?.primary?.enabled?.bg) : null,
								"--card-muted-fg-color": isSelected ? (hasError ? sanity?.color?.solid?.critical?.enabled?.muted?.fg : sanity?.color?.solid?.primary?.enabled?.muted?.fg) : null,
							}}
						>
							<Flex gap={1} align={"center"} justify={"center"}>
								<Box flex={1}>
									{renderPreview({
										value: preview?.draft || preview?.published,
										schemaType: schemaType?.of[0]?.to[0],
										layout: layout,
									})}
								</Box>
								{documentPresence && documentPresence?.length > 0
									? (
										<Box>
											<FieldPresenceInner presence={documentPresence} maxAvatars={1} />
										</Box>
									)
									: ""
								}
								{preview?.draft || preview?.published
									? (
										<>
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
															{...getPublishOrEditIconProps({ state: isPublished, isSelected: isSelected, ifSelected: hasError ? sanity?.color?.solid?.critical?.enabled?.accent?.fg : sanity?.color?.base?.bg })}
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
															{...getPublishOrEditIconProps({ state: isDraft, isSelected: isSelected, ifSelected: hasError ? sanity?.color?.solid?.critical?.enabled?.accent?.fg : sanity?.color?.base?.bg })}
														/>
													</Popover>
												</TextWithTone>
											</Box>
										</>
									)
									: ""
								}
							</Flex>
						</Button>
					</ReferenceChildLink>
				</Box>
				{hasError
					? (
						<Box padding={1}>
							<FormFieldValidationStatus validation={item?.validation} />
						</Box>
					)
					: ""
				}
				{item && item.path
					? (
						<Box
							className="jt-reference-multi-select-item-change-indicator-wrapper"
							style={{
								position: "absolute",
								top: 0,
								right: "calc(-0.2rem - 2px)",
								height: "calc(100% + 2px)",
							}}
						>
							<ChangeIndicator path={item?.path} isChanged={item?.changed} hasFocus={true} />
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