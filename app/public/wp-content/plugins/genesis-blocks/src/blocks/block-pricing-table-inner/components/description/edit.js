import { InnerBlocks } from '@wordpress/block-editor';

export default function Edit( { attributes: { className } } ) {
	return (
		<div className={ className } itemProp="description">
			<InnerBlocks allowedBlocks={ [ 'core/list' ] } />
		</div>
	);
}
