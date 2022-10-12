import { DateTime as LuxonDate } from 'luxon';


function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

export const createDateFromFormat = (date: Date, toFormat: string = "FF") => {
    const tempDate = formatDate(date);

    const fromFormat = `yyyy'-'LL'-'dd' 'HH':'mm':'ss`;

    // toFormat = "dd 'de' LLL 'de' yyyy, hh':'mm a";
    // toFormat = 'FF';

    return LuxonDate.fromFormat(tempDate, fromFormat, { zone: 'America/Lima' })
        .setLocale('es-PE')
        .toFormat(toFormat);

}

export const formatDate = (date: Date) => {
    const tempDate = new Date(date);

    return (
        [
            tempDate.getFullYear(),
            padTo2Digits(tempDate.getMonth() + 1),
            padTo2Digits(tempDate.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(tempDate.getHours()),
            padTo2Digits(tempDate.getMinutes()),
            padTo2Digits(tempDate.getSeconds()),
        ].join(':')
    );
}