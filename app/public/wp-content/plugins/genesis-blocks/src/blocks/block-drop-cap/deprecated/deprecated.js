import { RichText } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

import DropCap from './dropcap';
import migrate from './utils/migrate';

const v1 = {
	attributes: {
		dropCapContent: {
			type: 'array',
			selector: '.gb-drop-cap-text',
			source: 'children',
		},
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
	save( props ) {
		const { dropCapContent } = props.attributes;

		return (
			<DropCap { ...props }>
				{
					dropCapContent && (
						<RichText.Content
							tagName="div"
							className="gb-drop-cap-text"
							value={ dropCapContent }
						/>
					)
				}
			</DropCap>
		);
	},
	migrate: ( attributes ) => migrate( attributes, createBlock ),
};

export default [ v1 ];
