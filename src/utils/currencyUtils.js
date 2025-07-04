/**
 * Utility functions for currency formatting and calculations
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', locale = 'en-US') => {
  // Handle invalid amounts
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate tax amount based on subtotal and tax rate
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - The tax rate as a percentage (e.g., 7.5 for 7.5%)
 * @returns {number} - The calculated tax amount
 */
export const calculateTax = (subtotal, taxRate = 7.5) => {
  if (subtotal === null || subtotal === undefined || isNaN(subtotal)) {
    return 0;
  }
  
  return (subtotal * (taxRate / 100));
};

/**
 * Calculate total amount including tax
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - The tax rate as a percentage (e.g., 7.5 for 7.5%)
 * @returns {number} - The total amount including tax
 */
export const calculateTotal = (subtotal, taxRate = 7.5) => {
  if (subtotal === null || subtotal === undefined || isNaN(subtotal)) {
    return 0;
  }
  
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax;
};

/**
 * Calculate discount amount
 * @param {number} amount - The original amount
 * @param {number} discountPercent - The discount percentage (e.g., 10 for 10%)
 * @returns {number} - The discount amount
 */
export const calculateDiscount = (amount, discountPercent) => {
  if (amount === null || amount === undefined || isNaN(amount) ||
      discountPercent === null || discountPercent === undefined || isNaN(discountPercent)) {
    return 0;
  }
  
  return (amount * (discountPercent / 100));
};

/**
 * Apply discount to an amount
 * @param {number} amount - The original amount
 * @param {number} discountPercent - The discount percentage (e.g., 10 for 10%)
 * @returns {number} - The amount after discount
 */
export const applyDiscount = (amount, discountPercent) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 0;
  }
  
  if (discountPercent === null || discountPercent === undefined || isNaN(discountPercent)) {
    return amount;
  }
  
  const discount = calculateDiscount(amount, discountPercent);
  return amount - discount;
};

/**
 * Round a number to a specified number of decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - The number of decimal places (default: 2)
 * @returns {number} - The rounded value
 */
export const roundToDecimal = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};