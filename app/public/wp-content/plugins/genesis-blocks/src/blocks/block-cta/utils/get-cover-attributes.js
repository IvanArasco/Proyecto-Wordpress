import convertDimRatio from './convert-dim-ratio';

export default function getCoverAttributes( {
	buttonAlignment,
	className,
	ctaBackgroundColor,
	ctaWidth,
	dimRatio,
	imgAlt,
	imgID,
	imgURL,
} ) {
	return {
		align: ctaWidth === 'wide' ? undefined : ctaWidth,
		alt: imgAlt,
		className: className ? `gb-block-cta ${ className }` : 'gb-block-cta',
		contentPosition: `center ${ buttonAlignment }`,
		customOverlayColor: ctaBackgroundColor,
		// Set dimRatio (opacity) only if there's a background image.
		// Otherwise, it can unexpectedly have low opacity for customOverlayColor.
		// The CTA block only had a dimRatio when there was a background image (imgURL).
		dimRatio: imgURL ? convertDimRatio( dimRatio ) : undefined,
		id: imgID,
		minHeight: 13,
		minHeightUnit: 'em',
		style: { spacing: { padding: { top: '2%' } } },
		url: imgURL,
	};
}
