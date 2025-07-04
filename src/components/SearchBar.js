import React, { useState, useEffect } from 'react';

function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  initialValue = '',
  debounceTime = 300 // ms
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  
  // Debounce search to avoid too many searches while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch, debounceTime]);
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <div className="search-bar" style={{
      position: 'relative',
      maxWidth: '100%',
      width: '100%'
    }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 2.5rem 0.75rem 1rem',
          borderRadius: '4px',
          border: '1px solid #ced4da',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
        }}
      />
      
      {searchTerm && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: '#6c757d'
          }}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;