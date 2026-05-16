/**
 * Shared email validation regex and helper.
 * Used by LoginPage, RegisterPage, and property-based tests.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns true if the given string is a valid email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => EMAIL_REGEX.test(email);
