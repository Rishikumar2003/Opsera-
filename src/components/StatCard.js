import React from 'react';

function StatCard({ title, value, icon, color = '#3498db', onClick }) {
  return (
    <div 
      className="stat-card" 
      style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={onClick}
    >
      {icon && (
        <div 
          className="stat-icon" 
          style={{ 
            fontSize: '2rem', 
            color: color,
            marginBottom: '10px'
          }}
        >
          {icon}
        </div>
      )}
      
      <h3 style={{ fontSize: '1rem', color: '#7f8c8d', marginBottom: '10px' }}>{title}</h3>
      
      <div 
        className="number" 
        style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '10px'
        }}
      >
        {value}
      </div>
      
      {onClick && (
        <div className="stat-action">
          <button 
            className="btn" 
            style={{ 
              backgroundColor: color,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            onClick={onClick}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

export default StatCard;