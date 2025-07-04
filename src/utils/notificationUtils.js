/**
 * Utility functions for handling notifications and alerts
 */

// Store for active notifications
let notificationId = 0;
let activeNotifications = [];
let notificationCallback = null;

/**
 * Set the callback function for notifications
 * @param {Function} callback - The callback function to handle notifications
 */
export const setNotificationCallback = (callback) => {
  notificationCallback = callback;
};

/**
 * Show a notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type ('success', 'error', 'warning', 'info')
 * @param {number} duration - The duration in milliseconds (default: 3000, 0 for persistent)
 * @returns {number} - The notification ID
 */
export const showNotification = (message, type = 'info', duration = 3000) => {
  // Generate a unique ID for this notification
  const id = ++notificationId;
  
  // Create the notification object
  const notification = {
    id,
    message,
    type,
    timestamp: new Date().getTime()
  };
  
  // Add to active notifications
  activeNotifications = [...activeNotifications, notification];
  
  // Call the callback if set
  if (notificationCallback) {
    notificationCallback(activeNotifications);
  }
  
  // Set timeout to remove notification if duration is not 0
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification(id);
    }, duration);
  }
  
  return id;
};

/**
 * Dismiss a notification by ID
 * @param {number} id - The notification ID to dismiss
 */
export const dismissNotification = (id) => {
  // Remove the notification from active notifications
  activeNotifications = activeNotifications.filter(notification => notification.id !== id);
  
  // Call the callback if set
  if (notificationCallback) {
    notificationCallback(activeNotifications);
  }
};

/**
 * Dismiss all notifications
 */
export const dismissAllNotifications = () => {
  // Clear all notifications
  activeNotifications = [];
  
  // Call the callback if set
  if (notificationCallback) {
    notificationCallback(activeNotifications);
  }
};

/**
 * Get all active notifications
 * @returns {Array} - Array of active notifications
 */
export const getActiveNotifications = () => {
  return [...activeNotifications];
};

/**
 * Show a success notification
 * @param {string} message - The notification message
 * @param {number} duration - The duration in milliseconds (default: 3000)
 * @returns {number} - The notification ID
 */
export const showSuccess = (message, duration = 3000) => {
  return showNotification(message, 'success', duration);
};

/**
 * Show an error notification
 * @param {string} message - The notification message
 * @param {number} duration - The duration in milliseconds (default: 5000)
 * @returns {number} - The notification ID
 */
export const showError = (message, duration = 5000) => {
  return showNotification(message, 'error', duration);
};

/**
 * Show a warning notification
 * @param {string} message - The notification message
 * @param {number} duration - The duration in milliseconds (default: 4000)
 * @returns {number} - The notification ID
 */
export const showWarning = (message, duration = 4000) => {
  return showNotification(message, 'warning', duration);
};

/**
 * Show an info notification
 * @param {string} message - The notification message
 * @param {number} duration - The duration in milliseconds (default: 3000)
 * @returns {number} - The notification ID
 */
export const showInfo = (message, duration = 3000) => {
  return showNotification(message, 'info', duration);
};