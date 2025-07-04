import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  // In a real application, this data would come from an API or database
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      // This would be replaced with actual API calls
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
      
      const lowStock = storedProducts.filter(product => product.quantity < 10).length;
      
      setStats({
        totalProducts: storedProducts.length,
        totalCategories: storedCategories.length,
        lowStockItems: lowStock
      });
    };
    
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <div className="card">
        <h1>Welcome to Retail Inventory & Billing System</h1>
        <p>Manage your inventory, process sales, and gain insights into your business performance.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="number">{stats.totalProducts}</div>
          <Link to="/inventory" className="btn">View Inventory</Link>
        </div>
        
        <div className="stat-card">
          <h3>Product Categories</h3>
          <div className="number">{stats.totalCategories}</div>
          <Link to="/categories" className="btn">Manage Categories</Link>
        </div>
        
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="number">{stats.lowStockItems}</div>
          <Link to="/inventory" className="btn">Check Inventory</Link>
        </div>
        
        <div className="stat-card">
          <h3>Quick Billing</h3>
          <div className="number"><i className="fas fa-cash-register"></i></div>
          <Link to="/billing" className="btn btn-success">New Sale</Link>
        </div>
      </div>
      
      <div className="quick-actions card">
        <h2 className="card-title">Quick Actions</h2>
        <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/billing" className="btn">New Sale</Link>
          <Link to="/inventory?action=add" className="btn">Add Product</Link>
          <Link to="/categories?action=add" className="btn">Add Category</Link>
          <Link to="/insights" className="btn">View Reports</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;