import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import type {Locale} from './config';

dayjs.extend(jalaliday);

/**
 * نقشه‌ی تبدیل ارقام لاتین به ارقام فارسی
 */
const persianDigitsMap: Record<string, string> = {
	'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
	'5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
};

/**
 * تبدیل هر رشته یا عددی حاوی ارقام لاتین (0-9) به ارقام فارسی (۰-۹).
 * این تابع روی هر رشته‌ای کار می‌کند، حتی اگر شامل کاراکترهای دیگر (مثل / یا : یا متن) باشد.
 */
export function toPersianDigits(input: string | number): string {
	return String(input).replace(/[0-9]/g, (digit) => persianDigitsMap[digit]);
}

/**
 * فرمت‌بندی یک عدد بر اساس locale.
 * - locale === 'fa'  -> اعداد فارسی با قواعد عددنویسی فارسی (fa-IR)
 * - locale === 'en'  -> اعداد لاتین استاندارد (en-US)
 *
 * مثال: formatNumber(12345, 'fa') -> "۱۲٬۳۴۵"
 *       formatNumber(12345, 'en') -> "12,345"
 */
export function formatNumber(
		value: number | string,
		locale: Locale,
		options?: Intl.NumberFormatOptions
): string {
	const num = typeof value === 'string' ? Number(value) : value;

	if (Number.isNaN(num)) {
		return String(value);
	}

	const intlLocale = locale === 'fa' ? 'fa-IR' : 'en-US';
	return new Intl.NumberFormat(intlLocale, options).format(num);
}

/**
 * فرمت‌بندی تاریخ بر اساس locale.
 * - locale === 'fa'  -> تاریخ شمسی (جلالی) با ارقام فارسی، فرمت YYYY/MM/DD
 * - locale === 'en'  -> تاریخ میلادی استاندارد، فرمت YYYY-MM-DD
 *
 * ورودی می‌تواند Date, string قابل‌پارس (ISO)، یا timestamp عددی باشد.
 *
 * مثال: formatDate(new Date(), 'fa') -> "۱۴۰۳/۰۴/۰۱"
 *       formatDate(new Date(), 'en') -> "2025-06-21"
 */
export function formatDate(
		input: Date | string | number,
		locale: Locale,
		options?: { withTime?: boolean }
): string {
	const d = dayjs(input);

	if (locale === 'fa') {
		const calendarDate = d.calendar('jalali');
		const datePart = toPersianDigits(calendarDate.format('YYYY/MM/DD'));

		if (options?.withTime) {
			const timePart = toPersianDigits(calendarDate.format('HH:mm'));
			return `${datePart} - ${timePart}`;
		}

		return datePart;
	}

	const datePart = d.format('YYYY-MM-DD');

	if (options?.withTime) {
		return `${datePart} ${d.format('HH:mm')}`;
	}

	return datePart;
}

/**
 * گرفتن فقط سال (شمسی برای fa، میلادی برای en) از یک تاریخ.
 * مثال: formatYear(new Date(), 'fa') -> "۱۴۰۴"
 *       formatYear(new Date(), 'en') -> "2025"
 */
export function formatYear(input: Date | string | number, locale: Locale): string {
	const d = dayjs(input);

	if (locale === 'fa') {
		const year = d.calendar('jalali').format('YYYY');
		return toPersianDigits(year);
	}

	return d.format('YYYY');
}

/**
 * فرمت‌بندی نسبی تاریخ (مثلاً "۳ روز پیش" یا "3 days ago").
 * در صورت نیاز بعداً می‌توان پلاگین relativeTime را به dayjs اضافه کرد.
 * این تابع فعلاً به‌صورت ساده نوشته شده و قابل گسترش است.
 */
export function formatRelativeDays(
		input: Date | string | number,
		locale: Locale
): string {
	const now = dayjs();
	const target = dayjs(input);
	const diffDays = now.diff(target, 'day');

	if (locale === 'fa') {
		if (diffDays === 0) return 'امروز';
		if (diffDays === 1) return 'دیروز';
		return `${toPersianDigits(diffDays)} روز پیش`;
	}

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	return `${diffDays} days ago`;
}