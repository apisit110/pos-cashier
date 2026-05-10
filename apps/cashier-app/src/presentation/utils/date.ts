import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = 'Asia/Bangkok';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Formats a UTC date string to local time in Asia/Bangkok
 * @param date - UTC date string or Date object
 * @param format - Output format (default: YYYY-MM-DD HH:mm:ss)
 * @returns Formatted date string
 */
export const formatDateTime = (
  date: string | Date | number,
  format: string = DEFAULT_FORMAT
): string => {
  return dayjs.utc(date).tz(DEFAULT_TIMEZONE).format(format);
};

export default dayjs;
