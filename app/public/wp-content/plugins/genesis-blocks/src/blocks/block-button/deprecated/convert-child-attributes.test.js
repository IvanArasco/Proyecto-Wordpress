import convertChildAttributes from './convert-child-attributes';

describe( 'convertAttributes', () => {
	it.each( [
		[
			{},
			{
				className: 'gb-block-button',
				style: {
					border: { radius: '5px' },
					color: {
						background: '#3373dc',
						text: '#ffffff',
					},
					spacing: {
						padding: {
							top: '10px',
							bottom: '10px',
							left: '1em',
							right: '1em',
						},
					},
					typography: {
						fontSize: '20px',
						lineHeight: '1.2',
					}
				},
			},
		],
		[
			{
				className: 'here-is-a-class',
				buttonAlignment: 'right',
				buttonText: 'Click here',
				buttonSize: 'gb-button-size-large',
				buttonTarget: true,
				buttonBackgroundColor: '#00d084',
				buttonTextColor: '#9b51e0',
				buttonShape: 'gb-button-shape-square',
			},
			{
				className: 'here-is-a-class gb-block-button',
				text: 'Click here',
				linkTarget: '_blank',
				style: {
					border: { radius: '0px' },
					color: {
						background: '#00d084',
						text: '#9b51e0',
					},
					spacing: {
						padding: {
							top: '10px',
							bottom: '10px',
							left: '1.2em',
							right: '1.2em',
						},
					},
					typography: {
						fontSize: '26px',
						lineHeight: '1.8',
					}
				},
			},
		],
	] )( 'should convert the child attributes', ( attributes, expected ) => {
		expect( convertChildAttributes( attributes ) ).toEqual( expected );
	});
} );
