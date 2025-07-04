import React, { useEffect } from 'react';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium' // small, medium, large
}) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Prevent scrolling of the body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Determine modal width based on size prop
  let modalWidth;
  switch (size) {
    case 'small':
      modalWidth = '400px';
      break;
    case 'large':
      modalWidth = '800px';
      break;
    case 'medium':
    default:
      modalWidth = '600px';
  }
  
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div 
        className="modal-content" 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          width: modalWidth,
          maxWidth: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{
          padding: '1rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0 0.5rem',
              color: '#666'
            }}
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body" style={{
          padding: '1rem',
          overflowY: 'auto'
        }}>
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer" style={{
            padding: '1rem',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;