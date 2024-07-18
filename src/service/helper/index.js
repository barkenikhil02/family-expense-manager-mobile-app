import { formatDateToCustomString } from "../dateServices/dates";

export const undefinedCheck = (params) => {
  return params == undefined || params == null ? '--' : params;
};
// Helper function to format a value or display '-' if it's null || undefined
export const formatValue = (value, formatter) => {
  return value == undefined || value == null ? '-' : formatter(value);
}
// Helper function to format a date to a custom string
export const formatDate = (value) => {
  return value ? formatDateToCustomString(value) : '-';
}
// Helper function to format a date to a TextInput custom string
export const formattedDate = (text) => {
  const dateFormatRegex = /^(\d{4})(\d{2})(\d{2})$/;

  // Check if the input matches the date format using regex
  if (dateFormatRegex.test(text)) {
    // If it matches, format the date as YYYY-DD-MM
    return text.replace(dateFormatRegex, '$1-$2-$3');
  } else {
    // If it doesn't match, return the input as it is
    return text;
  }
};
export function notEmptyString(s) {
  return typeof s === 'string' && s?.trim() !== '';
}
export function hasDuplicates(array) {
  const seen = new Set();

  for (let i = 0; i < array.length; i++) {
    if (seen.has(array[i])) {
      return true;
    }
    seen.add(array[i]);
  }

  return false;
}