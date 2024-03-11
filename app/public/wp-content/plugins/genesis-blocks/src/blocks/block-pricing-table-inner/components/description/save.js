import { InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes: className } ) {
	return (
		<div className={ className } itemProp="description">
			<InnerBlocks.Content />
		</div>
	);
}
