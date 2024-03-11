export default function getListItems( html ) {
	return html.match( /(?<=<li>).*?(?=<\/li>)/g );
}
