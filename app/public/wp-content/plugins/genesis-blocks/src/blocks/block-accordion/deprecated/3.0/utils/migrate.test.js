import migrate from './migrate';

describe( 'migrate accordion', () => {
	it.each( [
		[
			{},
			{
				accordionTitle: '',
			},
		],
		[
			{
				accordionText: [ 'some text' ],
				accordionTitle: [
					{ type: 'p', props: { children: 'this is text' } },
				],
				className: 'your-class',
			},
			{
				accordionTitle: 'this is text',
				className: 'your-class',
			},
		],
	] )( 'should migrate the accordion', ( attributes, expected ) => {
		expect( migrate( attributes ) ).toEqual( expected );
	} );
} );
