/**
 * Notice Box Wrapper
 */

// Setup the block
const { Component } = wp.element;

// Import block dependencies and components
import classnames from 'classnames';
import generateUniqueID from '../../../utils/helpers/generate-unique-id';

/**
 * Create a Notice wrapper Component
 */
export default class NoticeBox extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: {
				noticeTitle,
				noticeAlignment,
				noticeBackgroundColor,
				noticeTextColor,
				noticeFontSize,
				noticeDismiss,
			},
		} = this.props;

		// Generate a unique ID for the dismissible notice
		const blockID = generateUniqueID( noticeDismiss + noticeTitle );

		return (
			<div
				style={ {
					color: noticeTextColor,
					textAlign: noticeAlignment,
					backgroundColor: noticeBackgroundColor,
				} }
				className={ classnames(
					this.props.className,
					noticeDismiss,
					'gb-font-size-' + noticeFontSize,
					'gb-block-notice'
				) }
				data-id={ blockID }
			>
				{ this.props.children }
			</div>
		);
	}
}
