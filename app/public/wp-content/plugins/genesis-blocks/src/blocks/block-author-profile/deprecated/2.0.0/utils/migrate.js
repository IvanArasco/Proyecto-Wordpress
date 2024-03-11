import { renderToString } from '@wordpress/element';
import removeParagraph from '../../../../../utils/helpers/remove-paragraph';

export default function migrate( {
	profileContent = [ '' ],
	profileName = [ '' ],
	profileTitle = [ '' ],
	...attributes
} ) {
	return {
		profileContent: renderToString( profileContent ),
		profileName: renderToString(
			profileName.map( removeParagraph )
		),
		profileTitle: renderToString(
			profileTitle.map( removeParagraph )
		),
		...attributes,
	};
}
