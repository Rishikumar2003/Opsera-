/**
 * Utility functions for form validation
 */

/**
 * Validates a product form
 * @param {Object} product - The product object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateProduct = (product) => {
  const errors = {};
  
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  }
  
  if (!product.categoryId) {
    errors.categoryId = 'Category is required';
  }
  
  if (!product.price || isNaN(product.price) || parseFloat(product.price) <= 0) {
    errors.price = 'Price must be a positive number';
  }
  
  if (!product.stock || isNaN(product.stock) || parseInt(product.stock) < 0) {
    errors.stock = 'Stock must be a non-negative number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a category form
 * @param {Object} category - The category object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateCategory = (category) => {
  const errors = {};
  
  if (!category.name || category.name.trim() === '') {
    errors.name = 'Category name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a billing form
 * @param {Object} billing - The billing object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateBilling = (billing) => {
  const errors = {};
  
  if (billing.customerName && billing.customerName.trim() !== '' && 
      (!billing.customerPhone || billing.customerPhone.trim() === '')) {
    errors.customerPhone = 'Phone number is required when customer name is provided';
  }
  
  if (billing.items.length === 0) {
    errors.items = 'At least one item must be added to the cart';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhone = (phone) => {
  // Basic phone validation - can be customized based on country/format requirements
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phone ? phoneRegex.test(phone) : true; // Optional field
};

/**
 * Validates an email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email ? emailRegex.test(email) : true; // Optional field
};