import React, { useState, useEffect, useRef } from 'react';

function BillingPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    // Load categories and products from localStorage
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    setCategories(storedCategories);
    setProducts(storedProducts);
    setFilteredProducts(storedProducts);
    
    // Generate invoice number
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${timestamp}-${randomPart}`);
  }, []);

  useEffect(() => {
    // Filter products based on selected category and search term
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const addToCart = (product) => {
    // Check if product is in stock
    if (product.quantity <= 0) {
      showAlert('Product is out of stock', 'danger');
      return;
    }
    
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Check if we have enough stock
      if (existingItem.quantity >= product.quantity) {
        showAlert('Not enough stock available', 'danger');
        return;
      }
      
      // Update quantity if already in cart
      const updatedCart = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      
      setCartItems(updatedCart);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        categoryId: product.categoryId,
        sku: product.sku
      }]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    // Find the product to check stock
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Validate quantity
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (newQuantity > product.quantity) {
      showAlert('Not enough stock available', 'danger');
      return;
    }
    
    // Update cart
    const updatedCart = cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCartItems(updatedCart);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    // Assuming a tax rate of 7%
    return calculateSubtotal() * 0.07;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showAlert('Cart is empty', 'danger');
      return;
    }
    
    // Update inventory
    const updatedProducts = products.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, quantity: product.quantity - cartItem.quantity };
      }
      return product;
    });
    
    // Save updated inventory
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    // Save sale record
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const newSale = {
      id: Date.now().toString(),
      invoiceNumber,
      date: new Date().toISOString(),
      customer: customerInfo,
      items: cartItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    };
    
    localStorage.setItem('sales', JSON.stringify([...sales, newSale]));
    
    // Show invoice
    setShowInvoice(true);
    
    // Generate new invoice number for next sale
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${timestamp}-${randomPart}`);
  };

  const printInvoice = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Reload the page to reset the state
    window.location.reload();
  };

  const startNewSale = () => {
    setCartItems([]);
    setCustomerInfo({ name: '', phone: '', email: '' });
    setShowInvoice(false);
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <div className="billing-page">
      <h1>Billing</h1>
      
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
      
      {showInvoice ? (
        <div className="invoice-container">
          <div className="card" ref={invoiceRef}>
            <div className="invoice-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> {invoiceNumber}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="invoice-customer" style={{ marginBottom: '20px' }}>
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {customerInfo.name || 'Walk-in Customer'}</p>
              {customerInfo.phone && <p><strong>Phone:</strong> {customerInfo.phone}</p>}
              {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
            </div>
            
            <div className="invoice-items">
              <h3>Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{getCategoryName(item.categoryId)}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="invoice-summary" style={{ marginTop: '20px', textAlign: 'right' }}>
              <p><strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}</p>
              <p><strong>Tax (7%):</strong> ${calculateTax().toFixed(2)}</p>
              <p style={{ fontSize: '1.2rem' }}><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
            </div>
            
            <div className="invoice-footer" style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <p>Thank you for your business!</p>
            </div>
          </div>
          
          <div className="invoice-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button className="btn" onClick={printInvoice}>Print Invoice</button>
            <button className="btn btn-success" onClick={startNewSale}>New Sale</button>
          </div>
        </div>
      ) : (
        <div className="billing-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="products-section">
            <div className="card">
              <h2 className="card-title">Select Products</h2>
              
              <div className="filter-controls" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="categoryFilter">Filter by Category</label>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="searchProduct">Search Products</label>
                  <input
                    type="text"
                    id="searchProduct"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name or SKU"
                  />
                </div>
              </div>
              
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {filteredProducts.length === 0 ? (
                  <p>No products found. Try changing your filters.</p>
                ) : (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="product-card" 
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: product.quantity <= 0 ? '#f8d7da' : 'white'
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <div className="product-name" style={{ fontWeight: 'bold' }}>{product.name}</div>
                      <div className="product-price">${product.price.toFixed(2)}</div>
                      <div className="product-stock" style={{ fontSize: '0.8rem', color: product.quantity <= 0 ? 'red' : 'green' }}>
                        {product.quantity <= 0 ? 'Out of stock' : `In stock: ${product.quantity}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="cart-section">
            <div className="card">
              <h2 className="card-title">Shopping Cart</h2>
              
              <div className="customer-info" style={{ marginBottom: '15px' }}>
                <h3>Customer Information (Optional)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label htmlFor="customerName">Name</label>
                    <input
                      type="text"
                      id="customerName"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      placeholder="Customer Name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="customerPhone">Phone</label>
                    <input
                      type="text"
                      id="customerPhone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerEmail">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    placeholder="Email Address"
                  />
                </div>
              </div>
              
              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <p>Cart is empty. Add products from the left panel.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="quantity-control" style={{ display: 'flex', alignItems: 'center' }}>
                              <button 
                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                style={{ width: '25px', height: '25px', padding: '0' }}
                              >
                                -
                              </button>
                              <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                style={{ width: '25px', height: '25px', padding: '0' }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => removeFromCart(item.id)}
                              style={{ padding: '2px 5px' }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="cart-summary" style={{ marginTop: '20px', textAlign: 'right' }}>
                <p><strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}</p>
                <p><strong>Tax (7%):</strong> ${calculateTax().toFixed(2)}</p>
                <p style={{ fontSize: '1.2rem' }}><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
              </div>
              
              <div className="checkout-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
                <button 
                  className="btn btn-success" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingPage;