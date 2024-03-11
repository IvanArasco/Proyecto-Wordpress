import getCoverAttributes from './get-cover-attributes';

describe( 'getCoverAttributes', () => {
	it.each( [
		[
			{
				buttonAlignment: 'center',
				ctaBackgroundColor: '#86adb8',
				ctaWidth: 'full',
				dimRatio: 80,
				imgAlt: 'Example Alt',
				imgID: 1000,
				imgURL: 'https://example.com/foo.jpg',
			},
			{
				align: 'full',
				alt: 'Example Alt',
				className: 'gb-block-cta',
				contentPosition: 'center center',
				customOverlayColor: '#86adb8',
				dimRatio: 20,
				id: 1000,
				minHeight: 13,
				minHeightUnit: 'em',
				style: { spacing: { padding: { top: '2%' } } },
				url: 'https://example.com/foo.jpg',
			},
		],
		[
			{
				buttonAlignment: 'center',
				className: 'this-is-a-class',
				ctaBackgroundColor: '#86adb8',
				ctaWidth: 'wide',
				dimRatio: 80,
				imgAlt: 'Example Alt',
				imgID: 1000,
				imgURL: undefined,
			},
			{
				align: undefined,
				alt: 'Example Alt',
				className: 'gb-block-cta this-is-a-class',
				contentPosition: 'center center',
				customOverlayColor: '#86adb8',
				dimRatio: undefined,
				id: 1000,
				minHeight: 13,
				minHeightUnit: 'em',
				style: { spacing: { padding: { top: '2%' } } },
				url: undefined,
			},
		],
	] )( 'should get the Cover block attributes', ( attributes, expected ) => {
		expect( getCoverAttributes( attributes ) ).toEqual( expected );
	} );
} );
