export default function removeParagraph( component ) {
	return component?.type === 'p' ? component?.props?.children : component;
}
