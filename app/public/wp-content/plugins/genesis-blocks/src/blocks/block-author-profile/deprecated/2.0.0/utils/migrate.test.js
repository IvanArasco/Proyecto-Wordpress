import migrate from './migrate';

describe( 'migrate Profile Box', () => {
	it.each( [
		[
			{},
			{
				profileName: '',
				profileTitle: '',
				profileContent: '',
			},
		],
		[
			{
				className: 'foo-class',
				clientId: '1b44e98e-9f3d-4b7d-828e-9a79ae6ef7ce',
				profileName: [
					'Here is a name',
					{ type: 'br', props: { children: [] } },
					'Second line of name',
				],
				profileTitle: [
					'Here is a title',
					{ type: 'br', props: { children: [] } },
					{ type: 'p', props: { children: 'Another line of title' } },
					'third line',
				],
				profileContent: [
					{ type: 'p', props: { children: 'Here is content' } },
					{ type: 'p', props: { children: 'Second line of content' } },
					{ type: 'p', props: { children: 'third line' } },
				],
			},
			{
				className: 'foo-class',
				clientId: '1b44e98e-9f3d-4b7d-828e-9a79ae6ef7ce',
				profileName: 'Here is a name<br/>Second line of name',
				profileTitle: 'Here is a title<br/>Another line of titlethird line',
				profileContent: '<p>Here is content</p><p>Second line of content</p><p>third line</p>',
			},
		],
	] )( 'should migrate the block', ( attributes, expected ) => {
		expect( migrate( attributes ) ).toEqual( expected );
	});
} );
