import React, { useState, useEffect } from 'react';
import { 
  getActiveNotifications, 
  setNotificationCallback, 
  dismissNotification 
} from '../utils/notificationUtils';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Set the callback to update notifications
    setNotificationCallback(setNotifications);
    
    // Initialize with any existing notifications
    setNotifications(getActiveNotifications());
    
    // Clean up on unmount
    return () => {
      setNotificationCallback(null);
    };
  }, []);
  
  // Get the appropriate styles for a notification type
  const getNotificationStyles = (type) => {
    const baseStyles = {
      padding: '12px 16px',
      marginBottom: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      animation: 'slideIn 0.3s ease-out forwards'
    };
    
    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#d4edda',
          color: '#155724',
          borderLeft: '4px solid #28a745'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderLeft: '4px solid #dc3545'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderLeft: '4px solid #ffc107'
        };
      case 'info':
      default:
        return {
          ...baseStyles,
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderLeft: '4px solid #17a2b8'
        };
    }
  };
  
  // Handle dismissing a notification
  const handleDismiss = (id) => {
    dismissNotification(id);
  };
  
  // If no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="notification-center"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '300px',
        maxWidth: '100%',
        zIndex: 9999
      }}
    >
      {notifications.map(notification => (
        <div 
          key={notification.id}
          style={getNotificationStyles(notification.type)}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-message">{notification.message}</div>
          <button
            onClick={() => handleDismiss(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px',
              color: 'inherit',
              opacity: 0.7
            }}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default NotificationCenter;