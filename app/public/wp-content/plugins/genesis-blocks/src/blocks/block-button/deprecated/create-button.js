import { createBlock } from '@wordpress/blocks';
import convertChildAttributes from './convert-child-attributes';
import convertParentAttributes from './convert-parent-attributes';

export default function createButton( attributes ) {
	return createBlock(
		'core/buttons',
		convertParentAttributes( attributes ),
		[
			createBlock(
				'core/button',
				convertChildAttributes( attributes )
			),
		]
	);
}
