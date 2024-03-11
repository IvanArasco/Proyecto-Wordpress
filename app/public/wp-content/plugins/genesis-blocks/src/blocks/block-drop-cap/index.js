/**
 * BLOCK: Genesis Blocks Drop Cap
 */

// Import block dependencies and components
import classnames from 'classnames';
import Inspector from './components/inspector';
import DropCap from './components/dropcap';
import deprecated from './deprecated/deprecated';

// Import CSS
import './styles/style.scss';
import './styles/editor.scss';

// Internationalization
const { __ } = wp.i18n;

// Extend component
const { Component } = wp.element;

// Register block
const { registerBlockType } = wp.blocks;

// Register editor components
const { AlignmentToolbar, BlockControls, InnerBlocks } = wp.blockEditor;

class GBDropCapBlock extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: { dropCapAlignment, dropCapFontSize },
		} = this.props;

		return [
			// Show the alignment toolbar on focus
			<BlockControls key="controls">
				<AlignmentToolbar
					value={ dropCapAlignment }
					onChange={ ( value ) =>
						this.props.setAttributes( { dropCapAlignment: value } )
					}
				/>
			</BlockControls>,

			// Show the block controls on focus
			<Inspector
				key={ 'gb-drop-cap-inspector-' + this.props.clientId }
				{ ...this.props }
			/>,

			// Show the block markup in the editor
			<DropCap
				key={ 'gb-drop-cap-' + this.props.clientId }
				{ ...this.props }
			>
				<div
					className={ classnames(
						'gb-drop-cap-text',
						'gb-font-size-' + dropCapFontSize
					) }
				>
					<InnerBlocks allowedBlocks={ [ 'core/paragraph' ] } />
				</div>
			</DropCap>,
		];
	}
}

// Register the block
registerBlockType( 'genesis-blocks/gb-drop-cap', {
	title: __( 'Drop Cap', 'genesis-blocks' ),
	description: __(
		'Add a styled drop cap to the beginning of your paragraph.',
		'genesis-blocks'
	),
	icon: 'format-quote',
	category: 'genesis-blocks',
	keywords: [
		__( 'drop cap', 'genesis-blocks' ),
		__( 'quote', 'genesis-blocks' ),
		__( 'genesis', 'genesis-blocks' ),
	],
	attributes: {
		dropCapAlignment: {
			type: 'string',
		},
		dropCapBackgroundColor: {
			type: 'string',
			default: '#f2f2f2',
		},
		dropCapTextColor: {
			type: 'string',
			default: '#32373c',
		},
		dropCapFontSize: {
			type: 'number',
			default: 3,
		},
		dropCapStyle: {
			type: 'string',
			default: 'drop-cap-letter',
		},
	},
	gb_settings_data: {
		gb_dropcap_dropCapFontSize: {
			title: __( 'Drop Cap Size', 'genesis-blocks' ),
		},
		gb_dropcap_dropCapStyle: {
			title: __( 'Drop Cap Style', 'genesis-blocks' ),
		},
	},

	// Render the block components
	edit: GBDropCapBlock,

	// Save the attributes and markup
	save( props ) {
		// Save the block markup for the front end
		return (
			<DropCap { ...props }>
				<div className="gb-drop-cap-text">
					<InnerBlocks.Content />
				</div>
			</DropCap>
		);
	},
	deprecated,
} );
