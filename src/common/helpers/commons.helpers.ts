import { DateTime as LuxonDate } from 'luxon';

export const createDateFromFormat = (
    date: Date,
    toFormat = "ff"
) => {

    return LuxonDate.fromISO(date.toISOString())
        .toFormat(toFormat, { locale: 'es' });
}
