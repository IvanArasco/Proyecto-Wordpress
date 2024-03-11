import md5 from 'md5';

// Generate a unique ID for the notice block
export default function generateUniqueID( input ) {
	return md5( input ).substr( 0, 6 );
}
