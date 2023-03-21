import { logo } from "./logo"
import { Box, Card, Heading, Stack, Text } from "@sanity/ui"

export const projectSheet = ({document}) => (
	<>
		{logo}
		<Box padding={5} style={{
			height: "100%",
			background: "linear-gradient(to bottom, #ffffff 10%, #91A3B0 100%)",
			backgroundRepeat: "no-repeat",
			backgroundAttachment: "fixed",
		}}>
			<Stack padding={2.5}>
				<Card style={{ background: "transparent" }}>
					<Heading as="h1" size={5} style={{ textAlign: "center" }}>
						{document.displayed.title}
					</Heading>
				</Card>
				<Card padding={5} style={{ background: "transparent" }}>
					<Text style={{ textAlign: "center" }}>
						Description
					</Text>
				</Card>
			</Stack>
		</Box>
	</>
)