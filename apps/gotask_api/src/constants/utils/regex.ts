export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const insertSpaceBeforeCapital = /([A-Z])/g;
export const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
