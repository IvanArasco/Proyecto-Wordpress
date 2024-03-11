function withStyle( {
		buttonAlignment,
		buttonBackgroundColor,
		buttonShape,
		buttonSize,
		buttonTextColor,
		style,
		...attributes
	} ) {
	return {
		...attributes,
		style: {
			...( style && style ),
			border: { radius: getBorderRadius( buttonShape ) },
			color: {
				background: buttonBackgroundColor || '#3373dc',
				text: buttonTextColor || '#ffffff',
			},
			spacing: {
				padding: {
					top: '10px',
					bottom: '10px',
					left: getHorizontalPadding( buttonSize ),
					right: getHorizontalPadding( buttonSize ),
				},
			},
			typography: {
				fontSize: getFontSize( buttonSize ),
				lineHeight: getLineHeight( buttonSize ),
			}
		},
	};
}

function getBorderRadius( shape ) {
	const defaultRadius = '5px';

	return {
		'gb-button-shape-square': '0px',
		'gb-button-shape-rounded': defaultRadius,
		'gb-button-shape-circular': '100px'
	}[ shape ] ?? defaultRadius;
}

function getFontSize( buttonSize ) {
	const medium = '20px';

	return {
		'gb-button-size-small': '14px',
		'gb-button-size-medium': medium,
		'gb-button-size-large': '26px',
		'gb-button-size-extralarge': '34px',
	}[ buttonSize ] ?? medium;
}

function getHorizontalPadding( buttonSize ) {
	const defaultPadding = '1em';

	return {
		'gb-button-size-large': '1.2em',
		'gb-button-size-extralarge': '1.2em',
	}[ buttonSize ] ?? defaultPadding;
}

function getLineHeight( buttonSize ) {
	const medium = '1.2';

	return {
		'gb-button-size-small': '0.8',
		'gb-button-size-medium': medium,
		'gb-button-size-large': '1.8',
		'gb-button-size-extralarge': '2.0',
	}[ buttonSize ] ?? medium;
}

function getNewKey( previousKey ) {
	return {
		buttonText: 'text',
		buttonUrl: 'url',
		buttonTarget: 'linkTarget',
	}[ previousKey ] ?? previousKey;
}

function getNewValue( previousKey, previousValue ) {
	if ( previousKey === 'buttonTarget' ) {
		return true === previousValue ? '_blank' : undefined;
	}

	return previousValue;
}

/** Converts attributes from the deprecated GB block to the Core Button block. */
export default function convertChildAttributes( { className, ...attributes } ) {
	return {
		className: !!className ? `${ className } gb-block-button` : 'gb-block-button',
		...Object.entries( withStyle( attributes ) ).reduce(
			( acc, [ previousKey, previousValue ] ) => {
				return {
					...acc,
					[ getNewKey( previousKey ) ]: getNewValue( previousKey, previousValue ),
				}
			},
			{}
		)
	};
}
