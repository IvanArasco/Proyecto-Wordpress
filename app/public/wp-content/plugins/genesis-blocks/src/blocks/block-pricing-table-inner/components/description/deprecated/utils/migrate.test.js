import migrate from './migrate';

function mockCreateBlock( name, attributes, innerBlocks ) {
	return {
		name,
		attributes,
		innerBlocks,
	};
}

describe( 'migrate', () => {
	it.each( [
		[
			{
				backgroundColor: 'vivid-red',
				className: 'this-is-the-class',
			},
			[
				{
					className: 'this-is-the-class',
				},
				[
					{
						name: 'core/list',
						attributes: {
							backgroundColor: 'vivid-red',
							className: 'gb-pricing-table-features',
							style: {
								color: {
									background: undefined,
									text: undefined,
								},
								spacing: {
									padding: {
										top: undefined,
										bottom: undefined,
										left: undefined,
										right: undefined,
									},
								},
								typography: { fontSize: undefined },
							},
							textColor: undefined,
						},
						innerBlocks: undefined,
					},
				],
			],
		],
		[
			{
				customBackgroundColor: '#e61f1f',
				borderStyle: 'gb-list-border-solid',
				borderWidth: 3,
				className: 'this-is-the-class',
				customFontSize: '16px',
				features: '<li>Here is a feature</li><li>This is the second feature</li>',
				paddingTop: '24px',
				paddingBottom: '20px',
				paddingLeft: '10px',
				paddingRight: '10px',
				textColor: 'theme-primary',
			},
			[
				{
					className: 'this-is-the-class',
				},
				[
					{
						name: 'core/list',
						attributes: {
							backgroundColor: undefined,
							className: 'gb-pricing-table-features gb-list-border-solid gb-list-border-width-3',
							style: {
								color: {
									background: '#e61f1f',
									text: undefined,
								},
								spacing: {
									padding: {
										top: '24px',
										bottom: '20px',
										left: '10px',
										right: '10px',
									},
								},
								typography: { fontSize: '16px' },
							},
							textColor: 'theme-primary',
						},
						innerBlocks: [
							{ name: 'core/list-item', attributes: { content: 'Here is a feature' } },
							{ name: 'core/list-item', attributes: { content: 'This is the second feature' } },
						],
					},
				],
			],
		],
	] )( 'should migrate the block', ( attributes, expected ) => {
		expect( migrate( attributes, mockCreateBlock ) ).toEqual( expected );
	});
} );
