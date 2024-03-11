/**
 * WordPress dependencies
 */
const { addFilter } = wp.hooks;

/**
 * Internal dependencies
 */
import { addResponsiveAttributes } from './utils';
import { withResponsiveSettings } from './components/with-responsive-settings';

if (
	genesis_blocks_globals.featuresEnabled?.includes( 'responsiveFontSettings' )
) {
	addFilter(
		'blocks.registerBlockType',
		'genesis-blocks/add-responsive-controls-attributes',
		addResponsiveAttributes
	);

	addFilter(
		'editor.BlockEdit',
		'genesis-blocks/add-responsive-controls',
		withResponsiveSettings
	);
}
