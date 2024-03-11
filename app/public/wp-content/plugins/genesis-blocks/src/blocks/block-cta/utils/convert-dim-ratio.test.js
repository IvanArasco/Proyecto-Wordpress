import convertDimRatio from './convert-dim-ratio';

describe( 'convertDimRatio', () => {
	it.each( [
		[ 0, 100 ],
		[ 100, 0 ],
		[ 90, 10 ],
		[ 10, 90 ],
		[ 50, 50 ],
		[ 29, 71 ],
	] )( 'should convert the dimRatio', ( attributes, expected ) => {
		expect( convertDimRatio( attributes ) ).toEqual( expected );
	} );
} );
