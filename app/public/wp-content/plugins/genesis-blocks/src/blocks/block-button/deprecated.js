import classnames from 'classnames';
import { RichText } from '@wordpress/block-editor';
import CustomButton from './components/button';

const v1 = {
	attributes: {
		buttonText: {
			type: 'string',
		},
		buttonUrl: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
		},
		buttonAlignment: {
			type: 'string',
		},
		buttonBackgroundColor: {
			type: 'string',
		},
		buttonTextColor: {
			type: 'string',
		},
		buttonSize: {
			type: 'string',
			default: 'gb-button-size-medium',
		},
		buttonShape: {
			type: 'string',
			default: 'gb-button-shape-rounded',
		},
		buttonTarget: {
			type: 'boolean',
			default: false,
		},
	},
	save( props ) {
		const {
			buttonText,
			buttonUrl,
			buttonBackgroundColor,
			buttonTextColor,
			buttonSize,
			buttonShape,
			buttonTarget,
		} = props.attributes;

		return (
			<CustomButton { ...props }>
				{ buttonText && (
					<a
						href={ buttonUrl }
						target={ buttonTarget ? '_blank' : null }
						rel={ buttonTarget ? 'noopener noreferrer' : null }
						className={ classnames(
							'gb-button',
							buttonShape,
							buttonSize
						) }
						style={ {
							color: buttonTextColor
								? buttonTextColor
								: '#ffffff',
							backgroundColor: buttonBackgroundColor
								? buttonBackgroundColor
								: '#3373dc',
						} }
					>
						<RichText.Content value={ buttonText } />
					</a>
				) }
			</CustomButton>
		);
	},
};

export default [ v1 ];
