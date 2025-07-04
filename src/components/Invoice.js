import React, { useRef } from 'react';

function Invoice({ 
  invoiceData, 
  onPrint,
  onClose
}) {
  const invoiceRef = useRef(null);
  
  const {
    invoiceNumber,
    date,
    customerName,
    customerPhone,
    items,
    subtotal,
    tax,
    total
  } = invoiceData;
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint(invoiceRef.current);
    } else {
      // Default print functionality
      const content = invoiceRef.current;
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-title { font-size: 24px; font-weight: bold; }
              .invoice-details { margin-bottom: 20px; }
              .customer-details { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              .text-right { text-align: right; }
              .total-row { font-weight: bold; }
              .print-hide { display: none; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Print after images and stylesheets have loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };
  
  return (
    <div className="invoice-wrapper" style={{
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
      <div className="invoice-modal" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        width: '800px',
        maxWidth: '90%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div className="invoice-modal-header" style={{
          padding: '1rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Invoice #{invoiceNumber}</h3>
          <div>
            <button 
              onClick={handlePrint} 
              className="btn" 
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Print
            </button>
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
        </div>
        
        <div className="invoice-modal-body" style={{
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div className="invoice-container" ref={invoiceRef}>
            <div className="invoice-header">
              <div>
                <div className="invoice-title">INVOICE</div>
                <div>Retail Inventory & Billing System</div>
              </div>
              <div className="invoice-details">
                <div><strong>Invoice #:</strong> {invoiceNumber}</div>
                <div><strong>Date:</strong> {date}</div>
              </div>
            </div>
            
            <div className="customer-details">
              <h3>Customer Information</h3>
              <div><strong>Name:</strong> {customerName || 'Walk-in Customer'}</div>
              {customerPhone && <div><strong>Phone:</strong> {customerPhone}</div>}
            </div>
            
            <div className="invoice-items">
              <h3>Purchased Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.sku}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-right"><strong>Subtotal:</strong></td>
                    <td className="text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-right"><strong>Tax:</strong></td>
                    <td className="text-right">${tax.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                    <td className="text-right">${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="invoice-footer" style={{ marginTop: '40px', textAlign: 'center' }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;