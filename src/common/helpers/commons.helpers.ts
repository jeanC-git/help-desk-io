import { DateTime as LuxonDate } from 'luxon';

export const createDateFromFormat = (
    date: Date,
    fromFormat: string = `yyyy'-'LL'-'dd'T'HH':'mm':'ss'.'SSS'Z'`,
    toFormat: string = "ff"
) => {

    return LuxonDate.fromISO(date.toISOString())
        .toFormat(toFormat, { locale: 'es' });
}
