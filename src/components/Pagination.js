import React from 'react';

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1
}) {
  // Generate page numbers array
  const generatePageNumbers = () => {
    const pageNumbers = [];
    
    // Add first page(s)
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pageNumbers.push(i);
    }
    
    // Calculate range around current page
    const startPage = Math.max(
      boundaryCount + 1,
      currentPage - siblingCount
    );
    
    const endPage = Math.min(
      totalPages - boundaryCount,
      currentPage + siblingCount
    );
    
    // Add ellipsis if there's a gap after boundary
    if (startPage > boundaryCount + 1) {
      pageNumbers.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis if there's a gap before last boundary
    if (endPage < totalPages - boundaryCount) {
      pageNumbers.push('...');
    }
    
    // Add last page(s)
    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  const pageNumbers = generatePageNumbers();
  
  return (
    <div className="pagination" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '1.5rem 0',
      gap: '0.25rem'
    }}>
      {/* Previous button */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #dee2e6',
          backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
          color: currentPage === 1 ? '#6c757d' : '#212529',
          borderRadius: '4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          marginRight: '0.25rem'
        }}
      >
        &laquo;
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          style={{
            padding: '0.5rem 0.75rem',
            border: page === currentPage ? '1px solid #3498db' : '1px solid #dee2e6',
            backgroundColor: page === currentPage ? '#3498db' : 'white',
            color: page === currentPage ? 'white' : page === '...' ? '#6c757d' : '#212529',
            borderRadius: '4px',
            cursor: typeof page === 'number' && page !== currentPage ? 'pointer' : 'default',
            fontWeight: page === currentPage ? 'bold' : 'normal'
          }}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #dee2e6',
          backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
          color: currentPage === totalPages ? '#6c757d' : '#212529',
          borderRadius: '4px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          marginLeft: '0.25rem'
        }}
      >
        &raquo;
      </button>
    </div>
  );
}

export default Pagination;