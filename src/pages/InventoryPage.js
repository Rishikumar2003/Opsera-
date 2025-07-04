import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function InventoryPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialAction = queryParams.get('action');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(initialAction === 'add');

  useEffect(() => {
    // Load products and categories from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    
    setProducts(storedProducts);
    setCategories(storedCategories);
  }, []);

  const saveProducts = (updatedProducts) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert price and quantity to numbers
    if (name === 'price' || name === 'quantity') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setNewProduct(prev => ({ ...prev, [name]: processedValue }));
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const generateSKU = () => {
    // Generate a random SKU if not provided
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `SKU-${randomPart}-${timestamp}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name.trim() || !newProduct.categoryId || !newProduct.price || !newProduct.quantity) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }
    
    let updatedProducts;
    const productToSave = { ...newProduct };
    
    // Generate SKU if not provided
    if (!productToSave.sku.trim()) {
      productToSave.sku = generateSKU();
    }
    
    if (editingId === null) {
      // Add new product
      const newProductWithId = {
        ...productToSave,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      updatedProducts = [...products, newProductWithId];
      showAlert('Product added successfully');
    } else {
      // Update existing product
      updatedProducts = products.map(prod => 
        prod.id === editingId ? { ...prod, ...productToSave, updatedAt: new Date().toISOString() } : prod
      );
      
      setEditingId(null);
      showAlert('Product updated successfully');
    }
    
    saveProducts(updatedProducts);
    setNewProduct({
      name: '',
      sku: '',
      categoryId: '',
      price: '',
      quantity: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      price: product.price,
      quantity: product.quantity,
      description: product.description || ''
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(prod => prod.id !== id);
      saveProducts(updatedProducts);
      showAlert('Product deleted successfully');
      
      // Reset form if we were editing the deleted product
      if (editingId === id) {
        cancelEdit();
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProduct({
      name: '',
      sku: '',
      categoryId: '',
      price: '',
      quantity: '',
      description: ''
    });
    setShowAddForm(false);
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory ? product.categoryId === filterCategory : true;
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="inventory-page">
      <h1>Inventory Management</h1>
      
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
      
      <div className="inventory-actions" style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Hide Form' : 'Add New Product'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="card">
          <h2 className="card-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="name">Product Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sku">SKU/Code (Optional)</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU or leave blank for auto-generation"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="categoryId">Category*</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price*</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="quantity">Quantity*</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              
              <button 
                type="button" 
                className="btn" 
                onClick={cancelEdit}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card">
        <h2 className="card-title">Products List</h2>
        
        <div className="filter-controls" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="searchTerm">Search Products</label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU"
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="filterCategory">Filter by Category</label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p>No products found. {products.length > 0 ? 'Try changing your filters.' : 'Add your first product above.'}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={product.quantity < 10 ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{getCategoryName(product.categoryId)}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    {product.quantity}
                    {product.quantity < 10 && (
                      <span className="low-stock-indicator" style={{ color: 'red', marginLeft: '5px' }}>
                        (Low Stock)
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn" 
                      onClick={() => handleEdit(product)}
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InventoryPage;