import migrate from './migrate';

function mockCreateBlock( name, { content } ) {
	return {
		name,
		attributes: { content },
	};
}

describe( 'migrate Notice block', () => {
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
				noticeContent: [ { type: 'p', props: { children: 'Here is some content' } } ],
			},
			[
				{
					noticeTitle: 'Example'
				},
				[
					{
						name: 'core/paragraph',
						attributes: {
							content: 'Here is some content',
						},
					},
				],
			],
		]
	] )( 'should migrate the block', ( attributes, expected ) => {
		expect( migrate( attributes, mockCreateBlock ) ).toEqual( expected );
	});
} );
