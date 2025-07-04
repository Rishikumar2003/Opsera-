import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BillingPage from './pages/BillingPage';
import InventoryPage from './pages/InventoryPage';
import CategoriesPage from './pages/CategoriesPage';
import InsightsPage from './pages/InsightsPage';
import NotificationCenter from './components/NotificationCenter';
import { initializeSampleData, generateSampleSales } from './utils/initData';
import { showSuccess } from './utils/notificationUtils';

function App() {
  useEffect(() => {
    // Initialize sample data if none exists
    const dataInitialized = initializeSampleData();
    
    // If we just initialized data, also generate sample sales
    if (dataInitialized) {
      generateSampleSales();
      showSuccess('Sample data has been loaded successfully!');
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>
      <NotificationCenter />
    </div>
  );
}

export default App;