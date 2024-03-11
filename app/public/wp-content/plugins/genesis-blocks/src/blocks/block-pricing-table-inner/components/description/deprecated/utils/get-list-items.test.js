import getListItems from './get-list-items';

describe( 'getListItems', () => {
	it.each( [
		[ '', null ],
		[
			'<li>unclosed list item<div>lorem ipsum</div>',
			null,
		],
		[
			'<li>malformed<li><li>inside li</li>',
			[ 'malformed<li><li>inside li' ],
		],
		[
			'<li>inside li</li>',
			[ 'inside li' ],
		],
		[
			'<div>unrelated</div><li>inside li</li>',
			[ 'inside li' ],
		],
		[
			'<li>first li</li><li>second li</li>',
			[
				'first li',
				'second li',
			],
		],
	] )( 'should get the list items', ( html, expected ) => {
		expect( getListItems( html ) ).toEqual( expected );
	} );
} );
