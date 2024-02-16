import { Reference } from "sanity";
import { useEffect, useState } from "react";
import useSanityClient from "../sanity.client";

const referenceConfig = {
	buildReference: (value: string, deps = []) => {
		const [data, setData] = useState({});
		const client = useSanityClient();
		useEffect(() => {
			async function getData() {
				const data = await client.fetch(`*[_id == "${value}"][0]`);
				setData(data);
			};
			getData();
		}, deps);
		return data;
	},
};

export default referenceConfig;