import removeParagraph from '../../../utils/helpers/remove-paragraph';

export default function migrate( {
	noticeContent = [ '' ],
	...attributes
},
createBlock ) {
	return [
		attributes,
		noticeContent.map( ( component ) => {
			return createBlock( 'core/paragraph', {
				content: removeParagraph( component ),
			} );
		} ),
	];
}
