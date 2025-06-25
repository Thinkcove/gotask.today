export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const insertSpaceBeforeCapital = /([A-Z])/g;
export const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const dateRegex = /^\d{4}[-/]\d{2}[-/]\d{2}/;
