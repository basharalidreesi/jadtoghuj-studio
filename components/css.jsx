export const hideElementUsingCssSelector = (props, selector) => {
	return (
		<>
			<style>{`
				${selector} {
					display: none;
				}
			`}</style>
			{props.renderDefault(props)}
		</>
	)
}