import removeParagraph from '../../../../utils/helpers/remove-paragraph';

export default function migrate( {
	dropCapContent = [ '' ],
	...attributes
},
createBlock ) {
	return [
		attributes,
		dropCapContent.map( ( component ) => {
			return createBlock( 'core/paragraph', {
				content: removeParagraph( component ),
			} );
		} ),
	];
}
