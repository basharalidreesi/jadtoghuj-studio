const urlConfig = {
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