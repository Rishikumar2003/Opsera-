import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">Retail Inventory & Billing</Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/billing">Billing</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/insights">Insights</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;