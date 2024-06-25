/* Converts a epoch unix timestamp to yy-mm-dd  hh-mm-ss format */
export function convertUnixTimestamp(timestamp) {
	// Create a new Date object with the Unix timestamp
	const date = new Date(timestamp * 1000);

	// Format the date and time
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// Return the formatted date and time
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

