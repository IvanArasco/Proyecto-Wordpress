/** Converts attributes from the deprecated GB block to the Core Buttons block. */
export default function convertParentAttributes( { buttonAlignment } ) {
	return buttonAlignment
		? {
				layout: {
					type: 'flex',
					justifyContent: buttonAlignment,
				},
		}
		: {};
}
