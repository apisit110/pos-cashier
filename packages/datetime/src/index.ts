import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat); // enables a second argument, e.g. dayjs('30012022', 'DDMMYYYY')

export const DEFAULT_TIMEZONE = 'Asia/Bangkok';
export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

dayjs.tz.setDefault(DEFAULT_TIMEZONE);

/**
 * Formats a UTC date to local time in DEFAULT_TIMEZONE (Asia/Bangkok).
 */
export const formatDateTime = (
  date: string | Date | number,
  format: string = DEFAULT_FORMAT,
): string => {
  return dayjs.utc(date).tz(DEFAULT_TIMEZONE).format(format);
};

export type { Dayjs } from 'dayjs';
export default dayjs;
