/**
 * @file Helper functions for common tasks.
 */

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 * @throws {Error} - If the email is invalid.  Throws a descriptive error message.
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email address format.');
  }
  return true;
};


/**
 * Validates a password.  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 * @throws {Error} If the password is invalid. Throws a descriptive error message.
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string' || password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.');
    }
    return true;
};


/**
 * Generates a unique ID.
 * @returns {string} - A unique ID.
 */
export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};


/**
 * Formats a date.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date.
 */
export const formatDate = (date) => {
  return date.toLocaleDateString();
};


/**
 * Handles errors gracefully.  Logs the error to the console and returns a user-friendly error message.
 * @param {Error} error - The error to handle.
 * @returns {string} - A user-friendly error message.
 */
export const handleError = (error) => {
  console.error('An error occurred:', error);
  return 'An unexpected error occurred. Please try again later.';
};


/**
 * Async function to simulate a delay.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>} Resolves after the specified delay.
 */
export const delay = async (ms) => {
  await new Promise(resolve => setTimeout(resolve, ms));
};


/**
 * Safely parses JSON string, handling potential errors.
 * @param {string} jsonString - JSON string to parse.
 * @returns {object | null} Parsed JSON object, or null if parsing fails.
 */
export const safeJsonParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

/**
 *  Adds an event listener and returns a cleanup function.
 * @param {EventTarget} target - The target element.
 * @param {string} type - The event type.
 * @param {EventListener} listener - The event listener function.
 * @returns {function} A cleanup function to remove the event listener.
 */
export const addEventListenerWithCleanup = (target, type, listener) => {
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
};

/**
 * Debounces a function to prevent excessive calls.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};