import convertParentAttributes from './convert-parent-attributes';

describe( 'convertAttributes', () => {
	it.each( [
		[
			{},
			{},
		],
		[
			{
				buttonAlignment: 'right',
			},
			{
				layout: {
					type: 'flex',
					justifyContent: 'right',
				}
			},
		],
	] )( 'should convert the parent attributes', ( attributes, expected ) => {
		expect( convertParentAttributes( attributes ) ).toEqual( expected );
	});
} );
