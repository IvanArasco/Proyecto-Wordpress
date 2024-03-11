import { renderToString } from '@wordpress/element';

export default function( {
	testimonialContent,
	testimonialName,
	testimonialTitle,
	...attributes
} ) {
	return {
		testimonialContent: renderToString( testimonialContent ),
		testimonialName: renderToString( testimonialName ),
		testimonialTitle: renderToString( testimonialTitle ),
		...attributes,
	};
}
