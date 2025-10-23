
export const toMonthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const toMonthEnd = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function toEllucianApiDateFormat ---------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function toEllucianApiDateFormat(inputDate) {
	if (!inputDate) return '';

	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (isNaN(date)) return '';

	return `${inputDate.toISOString().replace(/\.\d{3}Z$/, '')}+07:00`;
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateMonthYYYY ---------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateMonthYYYY(inputDate) {
	if (!inputDate) return '';
	let year, month, day;

	// Parse YYYY-MM-DD literal format (no timezone)
	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
		[year, month, day] = inputDate.split('-');
		const date = new Date(`${year}-${month}-${day}T00:00:00`);
		return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
	}

	// Fallback: handle JS Date object or other formats
	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (isNaN(date)) return '';

	return date.toLocaleDateString('en-US', { month: "long", year: "numeric" });
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateMMDDYYYY--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
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

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateMonthDDYYYY ---------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateMonthDDYYYY(inputDate) {
	if (!inputDate) return '';
	let year, month, day;

	// Parse YYYY-MM-DD literal format (no timezone)
	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
		[year, month, day] = inputDate.split('-');
		const date = new Date(`${year}-${month}-${day}T00:00:00`);
		return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', });
	}

	// Fallback: handle JS Date object or other formats
	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (isNaN(date)) return '';

	return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', });
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateMonthDYYYY ---------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateMonthDYYYY(inputDate) {
	if (!inputDate) return '';

	let year, month, day;

	// Parse YYYY-MM-DD literal format (no timezone)
	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
		[year, month, day] = inputDate.split('-');
		const date = new Date(`${year}-${month}-${day}T00:00:00`);
		return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', });
	}

	// Fallback: handle JS Date object or other formats
	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (isNaN(date)) return '';

	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', });
}
/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateTimeMMDDYYYY_HHMIAM--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateTimeMMDDYYYY_HHMIAM(inputDate) {
	if (!inputDate) return '';

	let date;
	if (inputDate instanceof Date) {
		date = inputDate;
	} else {
		date = new Date(inputDate);
	}

	if (isNaN(date)) return '';

	// Date parts
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	// Time parts
	let hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	if (hours === 0) hours = 12; // midnight or noon → 12

	return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateTimeMonthDDYYYY_HHMIAM-----------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateTimeMonthDDYYYY_HHMIAM(inputDate) {
	if (!inputDate) return '';

	let date;
	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(inputDate)) {
		date = new Date(inputDate.includes('T') ? inputDate : `${inputDate}T00:00:00`);
	} else {
		date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	}
	if (isNaN(date)) return '';

	const datePart = date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', });
	const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, });

	return `${datePart} ${timePart}`;
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatDateTimeMonthDYYYY_HMIAM -----------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatDateTimeMonthDYYYY_HMIAM(inputDate) {
	if (!inputDate) return '';

	let date;
	if (typeof inputDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(inputDate)) {
		date = new Date(inputDate.includes('T') ? inputDate : `${inputDate}T00:00:00`);
	} else {
		date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	}
	if (isNaN(date)) return '';

	const datePart = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', });

	// Use numeric options to avoid padded hours
	let hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12; // convert to 12-hour clock

	const timePart = `${hours}:${minutes} ${ampm}`;

	return `${datePart} ${timePart}`;
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function formatEpochSecondsToLA_MMDDYYYY_HHMIAM--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function formatEpochSecondsToLA_MMDDYYYY_HHMIAM(epochSeconds) {
	const secs = Number(epochSeconds);
	if (!secs || Number.isNaN(secs) || secs <= 0) return '';

	const date = new Date(secs * 1000);

	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: 'numeric',      // 12-hour
		minute: '2-digit',
		hour12: true
	})
		.formatToParts(date)
		.reduce((acc, p) => (acc[p.type] = p.value, acc), {});

	const month = parts.month;           // "07"
	const day = parts.day;               // "09"
	const year = parts.year;             // "2024"
	const hour = String(parts.hour).padStart(2, '0');  // "07" (pad to HH)
	const minute = parts.minute;         // "27"
	const ampm = parts.dayPeriod;        // "AM"/"PM"

	return `${month}/${day}/${year} ${hour}:${minute} ${ampm}`;
}