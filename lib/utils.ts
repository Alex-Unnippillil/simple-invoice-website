import { format as formatDateFn } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Formats a numeric amount into a currency string using Intl.NumberFormat.
 *
 * @param amount - The monetary value to format.
 * @param locale - BCP 47 locale string, defaults to 'en-US'.
 * @param currency - ISO 4217 currency code, defaults to 'USD'.
 */
export function formatMoney(amount: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a date using date-fns and optionally a time zone via date-fns-tz.
 *
 * @param date - Date instance or parseable date string.
 * @param pattern - date-fns format string, defaults to 'yyyy-MM-dd'.
 * @param timeZone - Optional IANA time zone. If provided, formats in that time zone.
 */
export function formatDate(
  date: Date | string,
  pattern = 'yyyy-MM-dd',
  timeZone?: string,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return timeZone ? formatInTimeZone(d, timeZone, pattern) : formatDateFn(d, pattern);
}
