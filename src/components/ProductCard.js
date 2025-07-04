import React from 'react';
import { formatCurrency } from '../utils/storage';

function ProductCard({ product, onClick, showStock = true }) {
  const isLowStock = product.quantity < 10;
  const isOutOfStock = product.quantity <= 0;
  
  return (
    <div 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${isLowStock ? 'low-stock' : ''}`}
      style={{ 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: isOutOfStock ? '#f8d7da' : isLowStock ? '#fff3cd' : 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onClick={onClick ? () => onClick(product) : undefined}
    >
      <div className="product-info">
        <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: '#2c3e50' }}>{product.name}</h3>
        <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '5px' }}>SKU: {product.sku}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
          {formatCurrency(product.price)}
        </p>
      </div>
      
      {showStock && (
        <div className="product-stock" style={{ 
          fontSize: '0.8rem', 
          color: isOutOfStock ? '#721c24' : isLowStock ? '#856404' : '#155724',
          backgroundColor: isOutOfStock ? '#f8d7da' : isLowStock ? '#fff3cd' : '#d4edda',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '8px'
        }}>
          {isOutOfStock 
            ? 'Out of stock' 
            : isLowStock 
              ? `Low stock: ${product.quantity}` 
              : `In stock: ${product.quantity}`
          }
        </div>
      )}
    </div>
  );
}

export default ProductCard;