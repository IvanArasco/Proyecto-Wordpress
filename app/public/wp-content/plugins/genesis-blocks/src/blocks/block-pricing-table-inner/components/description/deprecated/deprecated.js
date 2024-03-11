import { createBlock } from '@wordpress/blocks';
import save from './components/save';
import migrate from './utils/migrate';

const v1 = {
	attributes: {
		features: {
			type: 'string',
			source: 'html',
			selector: 'ol,ul',
			multiline: 'li',
		},
		fontSize: {
			type: 'string',
		},
		customFontSize: {
			type: 'number',
		},
		textColor: {
			type: 'string',
		},
		customTextColor: {
			type: 'string',
		},
		backgroundColor: {
			type: 'string',
		},
		customBackgroundColor: {
			type: 'string',
		},
		borderStyle: {
			type: 'string',
			default: 'gb-list-border-none',
		},
		borderColor: {
			type: 'string',
		},
		borderWidth: {
			type: 'number',
			default: 1,
		},
		paddingTop: {
			type: 'number',
			default: 10,
		},
		paddingRight: {
			type: 'number',
			default: 20,
		},
		paddingBottom: {
			type: 'number',
			default: 10,
		},
		paddingLeft: {
			type: 'number',
			default: 20,
		},
	},
	save,
	migrate: ( attributes ) => migrate( attributes, createBlock ),
};

export default [ v1 ];
