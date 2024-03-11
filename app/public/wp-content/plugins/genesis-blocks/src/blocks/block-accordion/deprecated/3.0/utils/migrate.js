import { renderToString } from '@wordpress/element';
import removeParagraph from '../../../../../utils/helpers/remove-paragraph';

export default function migrate( {
	accordionText,
	accordionTitle = [ '' ],
	...attributes
} ) {
	return {
		...attributes,
		accordionTitle: renderToString( accordionTitle.map( removeParagraph ) ),
	};
}
