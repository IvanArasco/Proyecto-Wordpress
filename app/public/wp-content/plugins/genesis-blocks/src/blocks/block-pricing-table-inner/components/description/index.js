/**
 * BLOCK: Genesis Blocks Pricing Table - Features Component
 */

// Import block dependencies and components
import edit from './edit';
import save from './save';
import deprecated from './deprecated/deprecated';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

// Register the block
registerBlockType( 'genesis-blocks/gb-pricing-table-features', {
	title: __( 'Product Features', 'genesis-blocks' ),
	description: __(
		'Adds a product feature component with schema markup.',
		'genesis-blocks'
	),
	icon: 'cart',
	category: 'genesis-blocks',
	supports: { inserter: false },
	keywords: [
		__( 'pricing table', 'genesis-blocks' ),
		__( 'features', 'genesis-blocks' ),
		__( 'shop', 'genesis-blocks' ),
	],
	edit,
	save,
	deprecated,
} );
