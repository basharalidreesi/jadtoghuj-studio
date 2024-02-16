import { useMemo } from "react";
import { useClient } from "sanity";

export const API_VERSION = "2023-10-01";

export default function useSanityClient() {
	const client = useClient({
		apiVersion: API_VERSION,
	});
	return useMemo(() => client, [client]);
};