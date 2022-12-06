import { DateTime as LuxonDate } from 'luxon';
import { Logger } from '@nestjs/common';

export const createDateFromFormat = (
  date: Date,
  toFormat = 'ff',
) => {

  return LuxonDate.fromISO(date.toISOString())
    .toFormat(toFormat, { locale: 'es' });
};


export const logTime = (message: string, context = 'LogTime') => {
  const logger = new Logger(context);

  const now = new Date();
  const timestamp = now.toISOString()
    .substring(11)
    .replace(/T/, ' ')
    .replace(/Z/, ' ');

  logger.debug(`Time: ${timestamp} | ${message}`);
};