/**
 * BLOCK: Notice
 */

// Import block dependencies and components
import classnames from 'classnames';
import Inspector from './components/inspector';
import NoticeBox from './components/notice';
import DismissButton from './components/button';
import icons from './components/icons';
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
const { RichText, AlignmentToolbar, BlockControls, InnerBlocks } =
	wp.blockEditor;

class GBNoticeBlock extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: {
				noticeTitle,
				noticeContent,
				noticeAlignment,
				noticeBackgroundColor,
				noticeTitleColor,
				noticeDismiss,
			},
			setAttributes,
		} = this.props;

		return [
			// Show the alignment toolbar on focus
			<BlockControls key="controls">
				<AlignmentToolbar
					value={ noticeAlignment }
					onChange={ ( value ) =>
						setAttributes( { noticeAlignment: value } )
					}
				/>
			</BlockControls>,

			// Show the block controls on focus
			<Inspector
				key={ 'gb-notice-inspector-' + this.props.clientId }
				{ ...{ setAttributes, ...this.props } }
			/>,

			// Show the block markup in the editor
			<NoticeBox
				key={ 'gb-notice-noticebox-' + this.props.clientId }
				{ ...this.props }
			>
				{
					// Check if the notice is dismissible and output the button
					noticeDismiss && 'gb-dismissable' === noticeDismiss && (
						<DismissButton { ...this.props }>
							{ icons.dismiss }
						</DismissButton>
					)
				}

				<RichText
					tagName="p"
					placeholder={ __( 'Notice Title', 'genesis-blocks' ) }
					value={ noticeTitle }
					className={ classnames( 'gb-notice-title' ) }
					style={ {
						color: noticeTitleColor,
					} }
					onChange={ ( value ) =>
						setAttributes( { noticeTitle: value } )
					}
				/>

				<div
					className="gb-notice-text"
					style={ {
						borderColor: noticeBackgroundColor,
					} }
				>
					<InnerBlocks />
				</div>
			</NoticeBox>,
		];
	}
}

// Register the block
registerBlockType( 'genesis-blocks/gb-notice', {
	title: __( 'Notice', 'genesis-blocks' ),
	description: __( 'Add a stylized text notice.', 'genesis-blocks' ),
	icon: 'format-aside',
	category: 'genesis-blocks',
	keywords: [
		__( 'notice', 'genesis-blocks' ),
		__( 'message', 'genesis-blocks' ),
		__( 'atomic', 'genesis-blocks' ),
	],
	attributes: {
		noticeTitle: {
			type: 'string',
			selector: '.gb-notice-title',
		},
		noticeAlignment: {
			type: 'string',
		},
		noticeBackgroundColor: {
			type: 'string',
			default: '#00d1b2',
		},
		noticeTextColor: {
			type: 'string',
			default: '#32373c',
		},
		noticeTitleColor: {
			type: 'string',
			default: '#fff',
		},
		noticeFontSize: {
			type: 'number',
			default: 18,
		},
		noticeDismiss: {
			type: 'string',
			default: '',
		},
	},

	gb_settings_data: {
		gb_notice_noticeFontSize: {
			title: __( 'Font Size', 'genesis-blocks' ),
		},
		gb_notice_noticeDismiss: {
			title: __( 'Notice Display', 'genesis-blocks' ),
		},
		gb_notice_colorSettings: {
			title: __( 'Notice Color', 'genesis-blocks' ),
		},
	},

	// Render the block components
	edit: GBNoticeBlock,

	// Save the attributes and markup
	save( props ) {
		// Setup the attributes
		const {
			noticeTitle,
			noticeBackgroundColor,
			noticeTitleColor,
			noticeDismiss,
		} = props.attributes;

		// Save the block markup for the front end
		return (
			<NoticeBox { ...props }>
				{ noticeDismiss && 'gb-dismissable' === noticeDismiss && (
					<DismissButton { ...props }>
						{ icons.dismiss }
					</DismissButton>
				) }

				{ noticeTitle && (
					<div
						className="gb-notice-title"
						style={ {
							color: noticeTitleColor,
						} }
					>
						<RichText.Content tagName="p" value={ noticeTitle } />
					</div>
				) }

				<div
					className="gb-notice-text"
					style={ {
						borderColor: noticeBackgroundColor,
					} }
				>
					<InnerBlocks.Content />
				</div>
			</NoticeBox>
		);
	},
	deprecated,
} );
