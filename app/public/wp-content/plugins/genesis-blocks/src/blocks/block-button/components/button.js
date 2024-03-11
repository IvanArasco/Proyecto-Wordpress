/**
 * Button Wrapper
 */

// Setup the block
const { Component } = wp.element;

// Import block dependencies and components
import classnames from 'classnames';

/**
 * Create a Button wrapper Component
 */
export default class CustomButton extends Component {
	render() {
		return (
			<div
				style={ {
					textAlign: this.props.attributes.buttonAlignment,
				} }
				className={ classnames(
					this.props.className,
					'gb-block-button'
				) }
			>
				{ this.props.children }
			</div>
		);
	}
}
