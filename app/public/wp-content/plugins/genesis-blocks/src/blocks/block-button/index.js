/**
 * BLOCK: Genesis Blocks Button
 */

// Don't delete this import, as it's used in the Pricing Table block.
import './styles/style.scss';

import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

import deprecated from './deprecated';
import createButton from './deprecated/create-button';

function Edit( { attributes, clientId } ) {
	const { replaceBlocks, replaceInnerBlocks } =
		useDispatch( 'core/block-editor' );
	const { getBlock, getBlockParents } = useSelect( ( select ) =>
		select( 'core/block-editor' )
	);

	useEffect( () => {
		const parentId = getBlockParents( clientId, true )?.[ 0 ];
		const hasParent = !! parentId;

		// Replace this GB Button block with the Core Button block.
		if ( hasParent ) {
			replaceInnerBlocks(
				parentId,
				getBlock( parentId ).innerBlocks?.map( ( block ) => {
					return block.clientId === clientId
						? createButton( attributes )
						: block;
				} )
			);
		} else {
			replaceBlocks( clientId, createButton( attributes ) );
		}
	}, [ clientId ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

// Register the block
registerBlockType( 'genesis-blocks/gb-button', {
	title: __( 'Button', 'genesis-blocks' ),
	description: __( 'Add a customizable button.', 'genesis-blocks' ),
	icon: 'admin-links',
	supports: { inserter: false },
	category: 'genesis-blocks',
	keywords: [
		__( 'button', 'genesis-blocks' ),
		__( 'link', 'genesis-blocks' ),
		__( 'genesis', 'genesis-blocks' ),
	],
	edit: Edit,
	save: () => null,
	deprecated,
} );
