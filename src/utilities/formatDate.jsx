function formatDateMMDDYYYY(inputDate) {
	if (!inputDate) return '';
	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (isNaN(date)) return '';
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const yyyy = date.getFullYear();
	return `${mm}/${dd}/${yyyy}`;
}