import article from "./article";
import bodyContent from "./bodyContent";
import category from "./category";
import colour from "./colour";
import doesHaveBorder from "./doesHaveBorder";
import headlinePlacement from "./headlinePlacement";
import headlineStyle from "./headlineStyle";
import heroImage from "./heroImage";
import homePage from "./homePage";
import imageHotspot from "./imageHotspot";
import imageHotspots from "./imageHotspots";
import isHiddenFromHomePage from "./isHiddenFromHomePage";
import isMarkedAsNewLook from "./isMarkedAsNewLook";
import link from "./link";
import mediaContent from "./mediaContent";
import metadata from "./metadata";
import padding from "./padding";
import pressItem from "./pressItem";
import project from "./project";
import recommendedItems from "./recommendedItems";
import referenceName from "./referenceName";
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
	imageHotspot,
	metadata,

	// misc. instances
	colour,
	doesHaveBorder,
	headlinePlacement,
	headlineStyle,
	heroImage,
	imageHotspots,
	isHiddenFromHomePage,
	isMarkedAsNewLook,
	mediaContent,
	padding,
	referenceName,
	tags,

	// PT instances
	bodyContent,
	simplePortableText,

];