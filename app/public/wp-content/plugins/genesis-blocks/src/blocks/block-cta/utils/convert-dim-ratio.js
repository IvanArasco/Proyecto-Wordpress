/**
 * Converts the dimRatio (opacity) that GB uses to the one Core uses.
 *
 * 100 in the GB CTA block means completely opaque.
 * 100 in the Core Cover block means completely transparent.
 * So a dimRatio of 90 in the GB CTA block
 * is a dimRatio of 10 in the Core Cover block.
 *
 * @param {string} dimRatio The opacity.
 * @return {string} The dimRatio that Core uses.
 */
export default function convertDimRatio( dimRatio ) {
	return 100 - dimRatio;
}
