import getListItems from './get-list-items';

export default function migrate(
	{
		backgroundColor,
		borderStyle,
		borderWidth,
		className,
		customBackgroundColor,
		customFontSize,
		customTextColor,
		features = '',
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		textColor,
	},
	createBlock
) {
	return [
		{ className },
		[
			createBlock(
				'core/list',
				{
					backgroundColor,
					className: [
						'gb-pricing-table-features',
						borderStyle,
						borderWidth ? `gb-list-border-width-${ borderWidth }` : undefined,
					].filter( Boolean ).join( ' ' ),
					style: {
						color: {
							background: customBackgroundColor,
							text: customTextColor,
						},
						spacing: {
							padding: {
								top: paddingTop,
								bottom: paddingBottom,
								left: paddingLeft,
								right: paddingRight,
							},
						},
						typography: { fontSize: customFontSize },
					},
					textColor,
				},
				getListItems( features )?.map( ( content ) => {
					return createBlock( 'core/list-item', { content } );
				} )
			),
		],
	];
}
