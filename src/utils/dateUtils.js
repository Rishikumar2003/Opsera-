/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date to a readable string
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format to use (default: 'full')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'full') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Return empty string for invalid dates
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'time':
      return dateObj.toLocaleTimeString();
    case 'datetime':
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    case 'iso':
      return dateObj.toISOString();
    case 'year-month':
      return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    case 'year-month-day':
      return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    case 'full':
    default:
      return dateObj.toLocaleString();
  }
};

/**
 * Get the current date as a string
 * @param {string} format - The format to use (default: 'full')
 * @returns {string} - Current date as a string
 */
export const getCurrentDate = (format = 'full') => {
  return formatDate(new Date(), format);
};

/**
 * Get the date for a specific number of days ago
 * @param {number} days - Number of days ago
 * @param {string} format - The format to use (default: 'full')
 * @returns {string} - Formatted date string
 */
export const getDaysAgo = (days, format = 'full') => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date, format);
};

/**
 * Get an array of dates between two dates
 * @param {Date|string|number} startDate - The start date
 * @param {Date|string|number} endDate - The end date
 * @param {string} format - The format to use for returned dates (default: 'year-month-day')
 * @returns {Array} - Array of formatted date strings
 */
export const getDatesBetween = (startDate, endDate, format = 'year-month-day') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  // Return empty array for invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return dates;
  }
  
  // Ensure start date is before end date
  if (start > end) {
    return dates;
  }
  
  let current = new Date(start);
  
  while (current <= end) {
    dates.push(formatDate(current, format));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * Get the start and end dates for a specific time period
 * @param {string} period - The time period ('today', 'yesterday', 'week', 'month', 'year')
 * @param {string} format - The format to use for returned dates (default: 'year-month-day')
 * @returns {Object} - Object with start and end dates
 */
export const getDateRangeForPeriod = (period, format = 'year-month-day') => {
  const today = new Date();
  let start, end;
  
  switch (period) {
    case 'today':
      start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      end = today;
      break;
    case 'yesterday':
      start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);
      break;
    case 'week':
      // Start of current week (Sunday)
      start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      end = today;
      break;
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
      break;
    case 'year':
      start = new Date(today.getFullYear(), 0, 1);
      end = today;
      break;
    default:
      start = today;
      end = today;
  }
  
  return {
    start: formatDate(start, format),
    end: formatDate(end, format)
  };
};