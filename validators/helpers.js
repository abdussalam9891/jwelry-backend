// validators/helpers.js
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Loose international phone check: digits, optional leading +, spaces/dashes allowed.
// Deliberately not stricter — a hard E.164-only regex would reject real numbers
// your admin will actually type (e.g. with spaces), and this isn't a billing system.
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function isValidPhone(value) {
  return typeof value === "string" && PHONE_REGEX.test(value.trim());
}

export function isValidUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    // eslint-disable-next-line no-new
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
