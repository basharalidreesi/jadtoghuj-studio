import article from "./article";
import bodyContent from "./bodyContent";
import category from "./category";
import heroImage from "./heroImage";
import homePage from "./homePage";
import isHiddenFromHomePage from "./isHiddenFromHomePage";
import link from "./link";
import mediaContent from "./mediaContent";
import metadata from "./metadata";
import pressItem from "./pressItem";
import project from "./project";
import recommendedItems from "./recommendedItems";
import simplePortableText from "./simplePortableText";
import studioInformation from "./studioInformation";
import tags from "./tags";
import websiteGlobals from "./websiteGlobals";

export const schemaTypes = [
	// documents
	article,
	category,
	pressItem,
	project,
	// singletons
	homePage,
	recommendedItems,
	studioInformation,
	websiteGlobals,
	// objects
	link,
	metadata,
	// misc. instances
	heroImage,
	isHiddenFromHomePage,
	mediaContent,
	tags,
	// PT instances
	bodyContent,
	simplePortableText,
];