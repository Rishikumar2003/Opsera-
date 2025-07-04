import React from 'react';
import Modal from './Modal';

function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'btn-danger',
  size = 'small'
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <button 
            className="btn" 
            onClick={onClose}
            style={{
              backgroundColor: '#f8f9fa',
              color: '#212529',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${confirmButtonClass}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              backgroundColor: confirmButtonClass === 'btn-danger' ? '#dc3545' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;