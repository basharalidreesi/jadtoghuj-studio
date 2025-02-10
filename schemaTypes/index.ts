import article from "./article";
import bodyContent from "./bodyContent";
import category from "./category";
import colour from "./colour";
import commonSlug from "./commonSlug";
import doesHaveBorder from "./doesHaveBorder";
import headlinePlacement from "./headlinePlacement";
import headlineStyle from "./headlineStyle";
import heroImage from "./heroImage";
import homePage from "./homePage";
import imageHotspot from "./imageHotspot";
import imageHotspots from "./imageHotspots";
import isHiddenFromListings from "./isHiddenFromListings";
import link from "./link";
import lookContent from "./lookContent";
import mediaContent from "./mediaContent";
import metadata from "./metadata";
import padding from "./padding";
import pressItem from "./pressItem";
import project from "./project";
import recommendedItems from "./recommendedItems";
import referenceName from "./referenceName";
import simplePortableText from "./simplePortableText";
import studioInformation from "./studioInformation";
import websiteGlobals from "./websiteGlobals";

export const schemaTypes = [
	
	// documents
	article,
	category,
	pressItem,
	project,

	// singletons
	// TODO aboutPage?
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
	commonSlug,
	doesHaveBorder,
	headlinePlacement,
	headlineStyle,
	heroImage,
	imageHotspots,
	isHiddenFromListings,
	lookContent,
	mediaContent,
	padding,
	referenceName,

	// PT instances
	bodyContent,
	simplePortableText,

];