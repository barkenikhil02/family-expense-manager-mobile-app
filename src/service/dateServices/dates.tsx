// import { useState } from "react";

// export const GetAsOfDate = (): Date => {
//     const currentDate = new Date();
//     return new Date(currentDate.setDate(currentDate.getDate()-1))
// };



import moment from "moment";
import { useState } from "react";

export const GetAsOfDate = (): Date => {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    // previousDate.setDate(currentDate.getDate() - 1);

    if (currentDate.getDate() - 1 === 0) {
        previousDate.setMonth(previousDate.getMonth() - 1);
        const lastDayOfPreviousMonth = new Date(previousDate.getFullYear(), previousDate.getMonth() + 1, 0).getDate();
        previousDate.setDate(lastDayOfPreviousMonth);
    }
    else {
        previousDate.setDate(currentDate.getDate() - 1);
    }
    // console.log(previousDate)
    return previousDate;
};

export const formatDateToString = (dateObject: Date) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = monthNames[dateObject.getMonth()];
    const year = dateObject.getFullYear();

    return `${month}-${year}`;
};

// export function formatDateToCustomString(inputDate: string): string {
//     const date = new Date(inputDate);
//     const options: Intl.DateTimeFormatOptions = {
//         month: 'long',
//         day: '2-digit',
//         year: 'numeric',
//     };

//     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

//     return formattedDate.replace(/ /g, '-');
// }

export function formatDateToCustomString(inputDate: string): string {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
}

export const formatDateToString1 = (date: Date) => {
    console.log(date);
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, '0');
    const day = String(date?.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function formatDate2(inputDate: Date): string {
    const months: string[] = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const month: string = months[inputDate.getMonth()];
    const day: number = inputDate.getDate();
    const year: number = inputDate.getFullYear();

    const formattedDate: string = `${day}-${month}-${year}`;
    return formattedDate;
}

export const formatDateToStringwithParse = (dateString: string) => {
    const dateParts = dateString.split(/[\/ :]/); // Split the date string using '/', ' ', and ':' as delimiters
    const year = Number(dateParts[2]);
    const month = Number(dateParts[0]);
    const day = Number(dateParts[1]);
    const hours = Number(dateParts[3]);
    const minutes = Number(dateParts[4]);
    const seconds = Number(dateParts[5]);

    const dateObject = new Date(year, month - 1, day, hours, minutes, seconds); // Month should be adjusted by -1 as it's zero-based

    const formattedDate = formatDateToString1(dateObject); // Use the previously defined function to format the date

    return formattedDate;
};


export const isBelow18 = (date: Date) => {
    const birthDate = new Date(date);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurredThisYear =
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() >= birthDate.getDate());
    if (!hasBirthdayOccurredThisYear) {
        age--;
    }
    return age < 18;
}

export const isAbove18 = (date: Date) => {
    const birthDate = new Date(date);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasBirthdayOccurredThisYear =
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() >= birthDate.getDate());
    if (!hasBirthdayOccurredThisYear) {
        age--;
    }
    return age > 18;
}

export function formatDate(inputDate: string): string {
    const months: string[] = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const [month, day, year]: number[] = inputDate.split("/")
        .map((datePart: string) => parseInt(datePart, 10));

    const abbreviatedMonth: string = months[month - 1];
    const formattedDate: string = `${day}-${abbreviatedMonth}-${year}`;
    return formattedDate;
}

//check if current time is more than cutOff time of instrument then returns true otherwise false. Required in Transaction.
export function isCurrentTimeGreaterThanCutoff(currentTime: string, cutoffTime: string): boolean {
    const currentMoment = moment(currentTime, 'HH:mm');
    const cutoffMoment = moment(cutoffTime, 'HH:mm');
    console.log(`Current Time = ${currentMoment} and cut off time = ${cutoffMoment}`)
    return currentMoment.isAfter(cutoffMoment);
}
