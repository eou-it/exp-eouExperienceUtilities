export function formatDateMMDDYYYY(inputDate) {
	if (!inputDate) return '';
	let year, month, day;

	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
		// Parse as literal parts, no timezone
		[year, month, day] = inputDate.split('-');
	} else {
		// Fallback: handle JS Date object
		const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
		if (isNaN(date)) return '';
		year = date.getFullYear();
		month = String(date.getMonth() + 1).padStart(2, '0');
		day = String(date.getDate()).padStart(2, '0');
	}

	return `${month}/${day}/${year}`;
}