// -----------------------------
// Common Utilities
// -----------------------------

import { EMAIL_PATTERN, PHONE_PATTERN } from "../constants/regex";

export const validateEmail = (email: string): boolean => EMAIL_PATTERN.test(email);
export const validatePhone = (phone: string): boolean => PHONE_PATTERN.test(phone);
