import removeParagraph from './remove-paragraph';

describe( 'removeParagraph', () => {
	it.each( [
		[ {}, {} ],
		[ 'basic text', 'basic text' ],
		[
			{ type: 'p', props: { children: 'inside paragraph' } },
			'inside paragraph',
		],
		[
			{ type: 'em', props: { children: 'inside em tag' } },
			{ type: 'em', props: { children: 'inside em tag' } },
		],
		[
			{ type: 'p', props: { children: 'inside paragraph' } },
			'inside paragraph',
		],
	] )( 'should remove the paragraph', ( component, expected ) => {
		expect( removeParagraph( component ) ).toEqual( expected );
	} );
} );
