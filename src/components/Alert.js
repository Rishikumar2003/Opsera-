import React, { useEffect } from 'react';

function Alert({ message, type = 'success', onClose, autoClose = true, autoCloseTime = 3000 }) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, autoCloseTime]);

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button 
          className="close-btn" 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default Alert;