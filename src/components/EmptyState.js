import React from 'react';

function EmptyState({ 
  title = 'No Data Found', 
  message = 'There are no items to display.', 
  actionText, 
  onAction 
}) {
  return (
    <div className="empty-state" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px dashed #dee2e6'
    }}>
      <div className="empty-icon" style={{
        fontSize: '3rem',
        color: '#adb5bd',
        marginBottom: '1rem'
      }}>
        📭
      </div>
      
      <h3 style={{ 
        fontSize: '1.25rem', 
        marginBottom: '0.5rem',
        color: '#495057'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: '#6c757d',
        marginBottom: onAction ? '1.5rem' : '0'
      }}>
        {message}
      </p>
      
      {onAction && actionText && (
        <button 
          className="btn" 
          onClick={onAction}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;