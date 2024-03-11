/**
 * BLOCK: Genesis Blocks Call-To-Action
 */

import { createBlock, registerBlockType } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { renderToString, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import createButton from '../block-button/deprecated/create-button';
import deprecated from './deprecated/deprecated';
import getCoverAttributes from './utils/get-cover-attributes';
import removeParagraph from '../../utils/helpers/remove-paragraph';

function Edit( {
	attributes: {
		buttonAlignment = 'center',
		buttonBackgroundColor,
		buttonShape,
		buttonSize,
		buttonTarget,
		buttonText,
		buttonTextColor,
		buttonUrl,
		className,
		ctaBackgroundColor = '#f2f2f2',
		ctaText = [ '' ],
		ctaTextColor,
		ctaTextFontSize,
		ctaTitle,
		ctaWidth,
		dimRatio,
		imgAlt,
		imgID,
		imgURL,
		titleFontSize = 32,
	},
	clientId,
} ) {
	const { replaceBlocks, replaceInnerBlocks } =
		useDispatch( 'core/block-editor' );
	const { getBlock, getBlockParents } = useSelect( ( select ) =>
		select( 'core/block-editor' )
	);

	useEffect( () => {
		const parentId = getBlockParents( clientId, true )?.[ 0 ];
		const hasParent = !! parentId;
		const newBlock = createBlock(
			'core/cover',
			getCoverAttributes( {
				buttonAlignment,
				className,
				ctaBackgroundColor,
				ctaWidth,
				dimRatio,
				imgAlt,
				imgID,
				imgURL,
			} ),
			[
				createBlock( 'core/heading', {
					content: renderToString( ctaTitle ),
					level: 2,
					placeholder: __( 'Call-To-Action Title', 'genesis-blocks' ),
					style: {
						color: { text: ctaTextColor },
						typography: {
							fontSize: titleFontSize,
							lineHeight: 1,
						},
					},
					textAlign: buttonAlignment,
				} ),
				...ctaText.map( ( text ) => {
					return createBlock( 'core/paragraph', {
						align: buttonAlignment,
						content: renderToString( removeParagraph( text ) ),
						placeholder: __(
							'Call To Action Text',
							'genesis-blocks'
						),
						style: {
							color: { text: ctaTextColor },
							typography: {
								...( ctaTextFontSize
									? { fontSize: ctaTextFontSize }
									: {} ),
								lineHeight: 1,
							},
						},
					} );
				} ),
				createButton( {
					buttonAlignment,
					buttonBackgroundColor,
					buttonShape,
					buttonSize,
					buttonTarget,
					buttonText,
					buttonTextColor,
					buttonUrl,
				} ),
			]
		);

		// Replace this block with Core blocks.
		if ( hasParent ) {
			replaceInnerBlocks(
				parentId,
				getBlock( parentId ).innerBlocks?.map( ( block ) => {
					return block.clientId === clientId ? newBlock : block;
				} )
			);
		} else {
			replaceBlocks( clientId, newBlock );
		}
	}, [ clientId ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

registerBlockType( 'genesis-blocks/gb-cta', {
	title: __( 'Call To Action', 'genesis-blocks' ),
	description: __(
		'Add a call to action section with a title, text, and a button.',
		'genesis-blocks'
	),
	icon: 'megaphone',
	category: 'genesis-blocks',
	keywords: [
		__( 'call to action', 'genesis-blocks' ),
		__( 'cta', 'genesis-blocks' ),
		__( 'atomic', 'genesis-blocks' ),
	],
	edit: Edit,
	save: () => null,
	deprecated,
} );
