import classnames from 'classnames';
import { getColorClassName, getFontSizeClass, RichText } from '@wordpress/block-editor';

export default function Save( props ) {
	const {
		features,
		fontSize,
		customFontSize,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		borderStyle,
		borderColor,
		borderWidth,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
	} = props.attributes;

	const fontSizeClass = getFontSizeClass( fontSize );
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);

	const className = classnames( {
		'has-background': backgroundColor || customBackgroundColor,
		'gb-pricing-table-features': true,
		[ fontSizeClass ]: fontSizeClass,
		[ textClass ]: textClass,
		[ backgroundClass ]: backgroundClass,
		[ borderStyle ]: borderStyle,
		[ 'gb-list-border-width-' + borderWidth ]: borderWidth,
	} );

	const styles = {
		fontSize: fontSizeClass ? undefined : customFontSize,
		backgroundColor: backgroundClass
			? undefined
			: customBackgroundColor,
		color: textClass ? undefined : customTextColor,
		borderColor: borderColor ? borderColor : undefined,
		paddingTop: paddingTop ? paddingTop + 'px' : undefined,
		paddingRight: paddingRight ? paddingRight + 'px' : undefined,
		paddingBottom: paddingBottom ? paddingBottom + 'px' : undefined,
		paddingLeft: paddingLeft ? paddingLeft + 'px' : undefined,
	};

	return (
		<RichText.Content
			tagName="ul"
			itemProp="description"
			value={ features }
			className={ className ? className : undefined }
			style={ styles }
		/>
	);
};
