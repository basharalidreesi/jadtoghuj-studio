const urlConfig = {
	validateUrlByHosts: function(value: string | undefined | null, hosts: ("YouTube" | "Vimeo" | "Spotify" | "Instagram" | "TikTok")[] = []) {
		if (!value) { return "Required"; };
		try {
			var doesMatchAKnownHost = false;
			const hostname = new URL(value)?.hostname?.replace("www.", "");
			hosts?.forEach((host) => {
				switch(host) {
					case "YouTube": if (hostname === "youtube.com" || hostname === "youtu.be") { doesMatchAKnownHost = true; return; };
					case "Vimeo": if (hostname === "vimeo.com") { doesMatchAKnownHost = true; return; };
					case "Spotify":
					case "Instagram":
					case "TikTok":
					default: return;
				};
			});
			if (!doesMatchAKnownHost) {
				return `Not a valid ${new Intl.ListFormat("en", { type: "disjunction" }).format(hosts)} URL.`;
			};
		} catch {
			return "Not a valid URL";
		};
		return true;
	},
	getThumbnailFromVideoUrl: function(value: string, objectFit: "cover" | "contain" = "cover") {
		if (!value) { return null; };
		try {
			var node = null;
			const hostname = new URL(value)?.hostname?.replace("www.", "");
			if (hostname === "youtube.com" || hostname === "youtu.be") {
				const videoId = value?.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)?.pop();
				const thumbnailUrl = `http://img.youtube.com/vi/${videoId}/0.jpg`;
				node = (<img src={thumbnailUrl} style={{ objectFit: objectFit }} />);
			};
			if (hostname === "vimeo.com") {
				const videoId = value?.match(/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/)?.pop();
				const thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
				node = (<img src={thumbnailUrl} style={{ objectFit: objectFit }} />);
			};
			return node;
		} catch(error) {
			console.error(error);
			return null;
		};
	},
};

export default urlConfig;