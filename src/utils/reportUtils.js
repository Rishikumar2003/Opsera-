/**
 * Utility functions for generating reports and exporting data
 */

import { formatDate } from './dateUtils';
import { formatCurrency } from './currencyUtils';

/**
 * Generate CSV content from an array of objects
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} headers - Array of header objects with key and label properties
 * @returns {string} - CSV content as a string
 */
export const generateCSV = (data, headers) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  // Create header row
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return headers.map(header => {
      // Get the value for this cell
      let value = item[header.key];
      
      // Format the value based on type if specified
      if (header.type === 'date' && value) {
        value = formatDate(value, header.format || 'short');
      } else if (header.type === 'currency' && value !== undefined) {
        value = formatCurrency(value).replace(/[^0-9.-]/g, '');
      }
      
      // Escape quotes and wrap in quotes
      return `"${value !== undefined && value !== null ? String(value).replace(/"/g, '""') : ''}"`;  
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 * @param {string} csvContent - CSV content as a string
 * @param {string} fileName - Name of the file to download
 */
export const downloadCSV = (csvContent, fileName = 'export.csv') => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  // Add link to document
  document.body.appendChild(link);
  
  // Click the link to download the file
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a sales report
 * @param {Array} sales - Array of sales data
 * @param {Array} products - Array of product data
 * @param {Array} categories - Array of category data
 * @param {string} reportType - Type of report to generate ('daily', 'monthly', 'product', 'category')
 * @param {Object} dateRange - Object with start and end dates
 * @returns {Object} - Report data
 */
export const generateSalesReport = (sales, products, categories, reportType, dateRange) => {
  if (!sales || !Array.isArray(sales) || sales.length === 0) {
    return { labels: [], datasets: [] };
  }
  
  // Filter sales by date range if provided
  let filteredSales = sales;
  if (dateRange && dateRange.start && dateRange.end) {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }
  
  // Generate report based on type
  switch (reportType) {
    case 'daily':
      return generateDailySalesReport(filteredSales);
    case 'monthly':
      return generateMonthlySalesReport(filteredSales);
    case 'product':
      return generateProductSalesReport(filteredSales, products);
    case 'category':
      return generateCategorySalesReport(filteredSales, products, categories);
    default:
      return { labels: [], datasets: [] };
  }
};

/**
 * Generate a daily sales report
 * @param {Array} sales - Array of sales data
 * @returns {Object} - Report data
 */
const generateDailySalesReport = (sales) => {
  // Group sales by date
  const salesByDate = {};
  
  sales.forEach(sale => {
    const date = formatDate(sale.date, 'year-month-day');
    
    if (!salesByDate[date]) {
      salesByDate[date] = 0;
    }
    
    salesByDate[date] += sale.total;
  });
  
  // Sort dates
  const sortedDates = Object.keys(salesByDate).sort();
  
  // Create report data
  return {
    labels: sortedDates.map(date => formatDate(date, 'short')),
    datasets: [{
      label: 'Daily Sales',
      data: sortedDates.map(date => salesByDate[date]),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
};

/**
 * Generate a monthly sales report
 * @param {Array} sales - Array of sales data
 * @returns {Object} - Report data
 */
const generateMonthlySalesReport = (sales) => {
  // Group sales by month
  const salesByMonth = {};
  
  sales.forEach(sale => {
    const date = new Date(sale.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!salesByMonth[month]) {
      salesByMonth[month] = 0;
    }
    
    salesByMonth[month] += sale.total;
  });
  
  // Sort months
  const sortedMonths = Object.keys(salesByMonth).sort();
  
  // Create report data
  return {
    labels: sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return `${new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    }),
    datasets: [{
      label: 'Monthly Sales',
      data: sortedMonths.map(month => salesByMonth[month]),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
};

/**
 * Generate a product sales report
 * @param {Array} sales - Array of sales data
 * @param {Array} products - Array of product data
 * @returns {Object} - Report data
 */
const generateProductSalesReport = (sales, products) => {
  // Create a map of product IDs to names
  const productMap = {};
  products.forEach(product => {
    productMap[product.id] = product.name;
  });
  
  // Group sales by product
  const salesByProduct = {};
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!salesByProduct[item.id]) {
        salesByProduct[item.id] = {
          quantity: 0,
          revenue: 0
        };
      }
      
      salesByProduct[item.id].quantity += item.quantity;
      salesByProduct[item.id].revenue += item.price * item.quantity;
    });
  });
  
  // Sort products by revenue
  const sortedProducts = Object.keys(salesByProduct).sort((a, b) => {
    return salesByProduct[b].revenue - salesByProduct[a].revenue;
  });
  
  // Create report data
  return {
    labels: sortedProducts.map(id => productMap[id] || `Product ${id}`),
    datasets: [{
      label: 'Revenue by Product',
      data: sortedProducts.map(id => salesByProduct[id].revenue),
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };
};

/**
 * Generate a category sales report
 * @param {Array} sales - Array of sales data
 * @param {Array} products - Array of product data
 * @param {Array} categories - Array of category data
 * @returns {Object} - Report data
 */
const generateCategorySalesReport = (sales, products, categories) => {
  // Create a map of product IDs to category IDs
  const productCategoryMap = {};
  products.forEach(product => {
    productCategoryMap[product.id] = product.categoryId;
  });
  
  // Create a map of category IDs to names
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category.id] = category.name;
  });
  
  // Group sales by category
  const salesByCategory = {};
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const categoryId = productCategoryMap[item.id];
      
      if (categoryId) {
        if (!salesByCategory[categoryId]) {
          salesByCategory[categoryId] = 0;
        }
        
        salesByCategory[categoryId] += item.price * item.quantity;
      }
    });
  });
  
  // Sort categories by revenue
  const sortedCategories = Object.keys(salesByCategory).sort((a, b) => {
    return salesByCategory[b] - salesByCategory[a];
  });
  
  // Create report data
  return {
    labels: sortedCategories.map(id => categoryMap[id] || `Category ${id}`),
    datasets: [{
      label: 'Revenue by Category',
      data: sortedCategories.map(id => salesByCategory[id]),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };
};