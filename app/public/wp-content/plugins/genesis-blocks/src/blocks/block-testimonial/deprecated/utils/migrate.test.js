import migrate from './migrate';

describe( 'migrate Testimonial', () => {
	it.each( [
		[
			{},
			{
				testimonialContent: '',
				testimonialName: '',
				testimonialTitle: '',
			},
		],
		[
			{
				className: 'this-is-a-class',
				testimonialContent: [
					{ type: 'p', props: { children: [ 'Here is testimonial content'] } },
					{ type: 'p', props: { children: [ 'Here is another line of testimonial content' ] } },
				],
				testimonialName: [
					'Here is a testimonial name',
					{ type: 'br', props: { children: [] } },
					'This is another line of name',
				],
				testimonialTitle: [
					'Here is a testimonial title',
					{ type: 'br', props: { children: [] } },
					'This is another line of title',
					{ type: 'br', props: { children: [] } },
					{ type: 'br', props: { children: [] } },
					'This is another line that has an empty line above',
				],
			},
			{
				className: 'this-is-a-class',
				testimonialContent: '<p>Here is testimonial content</p><p>Here is another line of testimonial content</p>',
				testimonialName: 'Here is a testimonial name<br/>This is another line of name',
				testimonialTitle: 'Here is a testimonial title<br/>This is another line of title<br/><br/>This is another line that has an empty line above',
			},
		],
	] )( 'should migrate the block', ( attributes, expected ) => {
		expect( migrate( attributes ) ).toEqual( expected );
	});
} );
