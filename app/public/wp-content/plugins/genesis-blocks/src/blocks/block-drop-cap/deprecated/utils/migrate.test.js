import migrate from './migrate';

function mockCreateBlock( name, { content } ) {
	return {
		name,
		attributes: { content },
	};
}

describe( 'convertAttributes', () => {
	it.each( [
		[
			{},
			[
				{},
				[ {
					name: 'core/paragraph',
					attributes: { content: '' },
				} ],
			],
		],
		[
			{
				noticeTitle: 'Example',
				dropCapContent: [ { type: 'p', props: { children: 'This is content' } } ],
			},
			[
				{
					noticeTitle: 'Example'
				},
				[
					{
						name: 'core/paragraph',
						attributes: {
							content: 'This is content',
						},
					},
				],
			],
		]
	] )( 'should migrate the block', ( attributes, expected ) => {
		expect( migrate( attributes, mockCreateBlock ) ).toEqual( expected );
	});
} );
