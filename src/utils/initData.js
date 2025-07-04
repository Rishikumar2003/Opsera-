import { getCategories, getProducts, saveCategories, saveProducts } from './storage';

/**
 * Initialize the application with sample data if no data exists
 */
export const initializeSampleData = () => {
  // Only initialize if no data exists
  if (getCategories().length === 0 && getProducts().length === 0) {
    // Sample categories
    const categories = [
      { id: 'cat1', name: 'Grocery', description: 'Food and household items', createdAt: new Date().toISOString() },
      { id: 'cat2', name: 'Electronics', description: 'Electronic devices and accessories', createdAt: new Date().toISOString() },
      { id: 'cat3', name: 'Clothing', description: 'Apparel and fashion items', createdAt: new Date().toISOString() },
      { id: 'cat4', name: 'Stationery', description: 'Office and school supplies', createdAt: new Date().toISOString() },
      { id: 'cat5', name: 'Pharmacy', description: 'Medicines and health products', createdAt: new Date().toISOString() }
    ];
    
    // Sample products
    const products = [
      // Grocery products
      { id: 'prod1', name: 'Milk', sku: 'GRO-1001', categoryId: 'cat1', price: 3.99, quantity: 50, description: '1 gallon whole milk', createdAt: new Date().toISOString() },
      { id: 'prod2', name: 'Bread', sku: 'GRO-1002', categoryId: 'cat1', price: 2.49, quantity: 30, description: 'Whole wheat bread', createdAt: new Date().toISOString() },
      { id: 'prod3', name: 'Eggs', sku: 'GRO-1003', categoryId: 'cat1', price: 3.29, quantity: 40, description: 'Dozen large eggs', createdAt: new Date().toISOString() },
      { id: 'prod4', name: 'Cereal', sku: 'GRO-1004', categoryId: 'cat1', price: 4.99, quantity: 25, description: 'Breakfast cereal', createdAt: new Date().toISOString() },
      { id: 'prod5', name: 'Coffee', sku: 'GRO-1005', categoryId: 'cat1', price: 8.99, quantity: 15, description: 'Ground coffee', createdAt: new Date().toISOString() },
      
      // Electronics products
      { id: 'prod6', name: 'Smartphone', sku: 'ELE-2001', categoryId: 'cat2', price: 599.99, quantity: 10, description: 'Latest model smartphone', createdAt: new Date().toISOString() },
      { id: 'prod7', name: 'Headphones', sku: 'ELE-2002', categoryId: 'cat2', price: 49.99, quantity: 15, description: 'Wireless headphones', createdAt: new Date().toISOString() },
      { id: 'prod8', name: 'Laptop', sku: 'ELE-2003', categoryId: 'cat2', price: 899.99, quantity: 8, description: '15-inch laptop', createdAt: new Date().toISOString() },
      { id: 'prod9', name: 'Tablet', sku: 'ELE-2004', categoryId: 'cat2', price: 349.99, quantity: 12, description: '10-inch tablet', createdAt: new Date().toISOString() },
      { id: 'prod10', name: 'Smartwatch', sku: 'ELE-2005', categoryId: 'cat2', price: 199.99, quantity: 7, description: 'Fitness tracking smartwatch', createdAt: new Date().toISOString() },
      
      // Clothing products
      { id: 'prod11', name: 'T-shirt', sku: 'CLO-3001', categoryId: 'cat3', price: 15.99, quantity: 25, description: 'Cotton t-shirt', createdAt: new Date().toISOString() },
      { id: 'prod12', name: 'Jeans', sku: 'CLO-3002', categoryId: 'cat3', price: 39.99, quantity: 20, description: 'Denim jeans', createdAt: new Date().toISOString() },
      { id: 'prod13', name: 'Sweater', sku: 'CLO-3003', categoryId: 'cat3', price: 29.99, quantity: 15, description: 'Wool sweater', createdAt: new Date().toISOString() },
      { id: 'prod14', name: 'Jacket', sku: 'CLO-3004', categoryId: 'cat3', price: 59.99, quantity: 10, description: 'Winter jacket', createdAt: new Date().toISOString() },
      { id: 'prod15', name: 'Socks', sku: 'CLO-3005', categoryId: 'cat3', price: 7.99, quantity: 30, description: 'Pack of 5 pairs', createdAt: new Date().toISOString() },
      
      // Stationery products
      { id: 'prod16', name: 'Notebook', sku: 'STA-4001', categoryId: 'cat4', price: 4.99, quantity: 100, description: 'Spiral notebook', createdAt: new Date().toISOString() },
      { id: 'prod17', name: 'Pens (Pack of 10)', sku: 'STA-4002', categoryId: 'cat4', price: 7.99, quantity: 50, description: 'Ballpoint pens', createdAt: new Date().toISOString() },
      { id: 'prod18', name: 'Pencils (Pack of 12)', sku: 'STA-4003', categoryId: 'cat4', price: 5.99, quantity: 40, description: 'No. 2 pencils', createdAt: new Date().toISOString() },
      { id: 'prod19', name: 'Sticky Notes', sku: 'STA-4004', categoryId: 'cat4', price: 3.99, quantity: 60, description: 'Pack of 5 pads', createdAt: new Date().toISOString() },
      { id: 'prod20', name: 'Stapler', sku: 'STA-4005', categoryId: 'cat4', price: 8.99, quantity: 25, description: 'Desktop stapler', createdAt: new Date().toISOString() },
      
      // Pharmacy products
      { id: 'prod21', name: 'Pain Reliever', sku: 'PHA-5001', categoryId: 'cat5', price: 6.99, quantity: 35, description: 'Bottle of 50 tablets', createdAt: new Date().toISOString() },
      { id: 'prod22', name: 'Bandages', sku: 'PHA-5002', categoryId: 'cat5', price: 4.49, quantity: 45, description: 'Box of 30 bandages', createdAt: new Date().toISOString() },
      { id: 'prod23', name: 'Vitamins', sku: 'PHA-5003', categoryId: 'cat5', price: 12.99, quantity: 20, description: 'Multivitamin supplements', createdAt: new Date().toISOString() },
      { id: 'prod24', name: 'Hand Sanitizer', sku: 'PHA-5004', categoryId: 'cat5', price: 3.99, quantity: 5, description: '8 oz bottle (Low Stock)', createdAt: new Date().toISOString() },
      { id: 'prod25', name: 'First Aid Kit', sku: 'PHA-5005', categoryId: 'cat5', price: 15.99, quantity: 3, description: 'Basic first aid supplies (Low Stock)', createdAt: new Date().toISOString() }
    ];
    
    // Save sample data
    saveCategories(categories);
    saveProducts(products);
    
    console.log('Sample data initialized successfully');
    return true;
  }
  
  console.log('Data already exists, skipping initialization');
  return false;
};

/**
 * Generate sample sales data for testing
 */
export const generateSampleSales = () => {
  const products = getProducts();
  const sales = [];
  
  // Generate 20 random sales over the past 30 days
  for (let i = 0; i < 20; i++) {
    // Random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Random items (1-5 items per sale)
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      // Pick a random product
      const product = products[Math.floor(Math.random() * products.length)];
      
      // Random quantity (1-5 units)
      const quantity = Math.floor(Math.random() * 5) + 1;
      
      // Check if product is already in the cart
      const existingItem = items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity if already in cart
        existingItem.quantity += quantity;
      } else {
        // Add new item to cart
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          categoryId: product.categoryId,
          sku: product.sku
        });
      }
      
      // Update subtotal
      subtotal += product.price * quantity;
    }
    
    // Calculate tax and total
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + tax;
    
    // Generate invoice number
    const timestamp = date.getTime().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${timestamp}-${randomPart}`;
    
    // Create sale object
    const sale = {
      id: `sale-${i + 1}`,
      invoiceNumber,
      date: date.toISOString(),
      customer: {
        name: `Customer ${i + 1}`,
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        email: `customer${i + 1}@example.com`
      },
      items,
      subtotal,
      tax,
      total
    };
    
    sales.push(sale);
  }
  
  // Save sales data
  localStorage.setItem('sales', JSON.stringify(sales));
  console.log('Sample sales data generated successfully');
  return true;
};