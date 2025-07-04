/**
 * Utility functions for handling localStorage operations
 */

// Categories
export const getCategories = () => {
  try {
    return JSON.parse(localStorage.getItem('categories')) || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const saveCategories = (categories) => {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving categories:', error);
    return false;
  }
};

// Products
export const getProducts = () => {
  try {
    return JSON.parse(localStorage.getItem('products')) || [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Sales
export const getSales = () => {
  try {
    return JSON.parse(localStorage.getItem('sales')) || [];
  } catch (error) {
    console.error('Error getting sales:', error);
    return [];
  }
};

export const saveSales = (sales) => {
  try {
    localStorage.setItem('sales', JSON.stringify(sales));
    return true;
  } catch (error) {
    console.error('Error saving sales:', error);
    return false;
  }
};

// Add a new sale
export const addSale = (sale) => {
  try {
    const sales = getSales();
    sales.push(sale);
    saveSales(sales);
    return true;
  } catch (error) {
    console.error('Error adding sale:', error);
    return false;
  }
};

// Get low stock products
export const getLowStockProducts = (threshold = 10) => {
  try {
    const products = getProducts();
    return products.filter(product => product.quantity < threshold);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    return [];
  }
};

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString();
};

// Generate a random SKU
export const generateSKU = () => {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = Date.now().toString().slice(-4);
  return `SKU-${randomPart}-${timestamp}`;
};

// Generate invoice number
export const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${randomPart}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return `$${Number(amount).toFixed(2)}`;
};

// Calculate tax (default 7%)
export const calculateTax = (amount, taxRate = 0.07) => {
  return amount * taxRate;
};

// Clear all data (for testing)
export const clearAllData = () => {
  try {
    localStorage.removeItem('categories');
    localStorage.removeItem('products');
    localStorage.removeItem('sales');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Initialize with sample data (for demo purposes)
export const initializeSampleData = () => {
  // Only initialize if no data exists
  if (getCategories().length === 0 && getProducts().length === 0) {
    // Sample categories
    const categories = [
      { id: 'cat1', name: 'Grocery', description: 'Food and household items', createdAt: new Date().toISOString() },
      { id: 'cat2', name: 'Electronics', description: 'Electronic devices and accessories', createdAt: new Date().toISOString() },
      { id: 'cat3', name: 'Clothing', description: 'Apparel and fashion items', createdAt: new Date().toISOString() },
      { id: 'cat4', name: 'Stationery', description: 'Office and school supplies', createdAt: new Date().toISOString() }
    ];
    
    // Sample products
    const products = [
      { id: 'prod1', name: 'Milk', sku: 'GRO-1001', categoryId: 'cat1', price: 3.99, quantity: 50, description: '1 gallon whole milk', createdAt: new Date().toISOString() },
      { id: 'prod2', name: 'Bread', sku: 'GRO-1002', categoryId: 'cat1', price: 2.49, quantity: 30, description: 'Whole wheat bread', createdAt: new Date().toISOString() },
      { id: 'prod3', name: 'Eggs', sku: 'GRO-1003', categoryId: 'cat1', price: 3.29, quantity: 40, description: 'Dozen large eggs', createdAt: new Date().toISOString() },
      { id: 'prod4', name: 'Smartphone', sku: 'ELE-2001', categoryId: 'cat2', price: 599.99, quantity: 10, description: 'Latest model smartphone', createdAt: new Date().toISOString() },
      { id: 'prod5', name: 'Headphones', sku: 'ELE-2002', categoryId: 'cat2', price: 49.99, quantity: 15, description: 'Wireless headphones', createdAt: new Date().toISOString() },
      { id: 'prod6', name: 'T-shirt', sku: 'CLO-3001', categoryId: 'cat3', price: 15.99, quantity: 25, description: 'Cotton t-shirt', createdAt: new Date().toISOString() },
      { id: 'prod7', name: 'Jeans', sku: 'CLO-3002', categoryId: 'cat3', price: 39.99, quantity: 20, description: 'Denim jeans', createdAt: new Date().toISOString() },
      { id: 'prod8', name: 'Notebook', sku: 'STA-4001', categoryId: 'cat4', price: 4.99, quantity: 100, description: 'Spiral notebook', createdAt: new Date().toISOString() },
      { id: 'prod9', name: 'Pens (Pack of 10)', sku: 'STA-4002', categoryId: 'cat4', price: 7.99, quantity: 50, description: 'Ballpoint pens', createdAt: new Date().toISOString() },
      { id: 'prod10', name: 'Low Stock Item', sku: 'TEST-5001', categoryId: 'cat1', price: 9.99, quantity: 5, description: 'This item has low stock', createdAt: new Date().toISOString() }
    ];
    
    // Save sample data
    saveCategories(categories);
    saveProducts(products);
    
    return true;
  }
  
  return false;
};