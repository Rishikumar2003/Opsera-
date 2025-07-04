import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function InsightsPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dateRange, setDateRange] = useState('weekly'); // daily, weekly, monthly
  const [categoryFilter, setCategoryFilter] = useState('');
  const [salesData, setSalesData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    
    setSales(storedSales);
    setProducts(storedProducts);
    setCategories(storedCategories);
    
    // Find low stock products
    const lowStock = storedProducts.filter(product => product.quantity < 10);
    setLowStockProducts(lowStock);
  }, []);

  useEffect(() => {
    if (sales.length > 0 && categories.length > 0) {
      generateReports();
    }
  }, [sales, products, categories, dateRange, categoryFilter]);

  const generateReports = () => {
    // Filter sales based on date range
    const filteredSales = filterSalesByDate(sales, dateRange);
    
    // Further filter by category if selected
    const categorySales = categoryFilter 
      ? filteredSales.filter(sale => 
          sale.items.some(item => item.categoryId === categoryFilter)
        )
      : filteredSales;
    
    // Generate sales by date chart data
    generateSalesByDateChart(categorySales);
    
    // Generate sales by category chart data
    generateSalesByCategoryChart(categorySales);
    
    // Generate sales by product chart data
    generateSalesByProductChart(categorySales);
    
    // Generate sales trend chart data
    generateSalesTrendChart(categorySales);
    
    // Calculate top selling products
    calculateTopProducts(categorySales);
  };

  const filterSalesByDate = (salesData, range) => {
    const now = new Date();
    let startDate;
    
    switch (range) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
    }
    
    return salesData.filter(sale => new Date(sale.date) >= startDate);
  };

  const generateSalesByDateChart = (salesData) => {
    if (salesData.length === 0) {
      setSalesData(null);
      return;
    }
    
    // Group sales by date
    const salesByDate = {};
    
    salesData.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += sale.total;
    });
    
    // Prepare chart data
    const labels = Object.keys(salesByDate);
    const data = Object.values(salesByDate);
    
    setSalesData({
      labels,
      datasets: [
        {
          label: 'Sales Amount',
          data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        },
      ],
    });
  };

  const generateSalesByCategoryChart = (salesData) => {
    if (salesData.length === 0 || categories.length === 0) {
      setCategoryData(null);
      return;
    }
    
    // Create a map of category IDs to names
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });
    
    // Group sales by category
    const salesByCategory = {};
    
    salesData.forEach(sale => {
      sale.items.forEach(item => {
        const categoryName = categoryMap[item.categoryId] || 'Unknown';
        if (!salesByCategory[categoryName]) {
          salesByCategory[categoryName] = 0;
        }
        salesByCategory[categoryName] += item.price * item.quantity;
      });
    });
    
    // Prepare chart data
    const labels = Object.keys(salesByCategory);
    const data = Object.values(salesByCategory);
    
    setCategoryData({
      labels,
      datasets: [
        {
          label: 'Sales by Category',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const generateSalesByProductChart = (salesData) => {
    if (salesData.length === 0) {
      setProductData(null);
      return;
    }
    
    // Group sales by product
    const salesByProduct = {};
    
    salesData.forEach(sale => {
      sale.items.forEach(item => {
        if (!salesByProduct[item.name]) {
          salesByProduct[item.name] = 0;
        }
        salesByProduct[item.name] += item.quantity;
      });
    });
    
    // Sort and limit to top 10 products
    const sortedProducts = Object.entries(salesByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Prepare chart data
    const labels = sortedProducts.map(item => item[0]);
    const data = sortedProducts.map(item => item[1]);
    
    setProductData({
      labels,
      datasets: [
        {
          label: 'Units Sold',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    });
  };

  const generateSalesTrendChart = (salesData) => {
    if (salesData.length === 0) {
      setTrendData(null);
      return;
    }
    
    // Group sales by date for trend analysis
    const salesByDate = {};
    
    // Create date range based on selected period
    const now = new Date();
    let startDate;
    let dateFormat;
    
    switch (dateRange) {
      case 'daily':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - 6); // Last 7 days
        dateFormat = date => `${date.getMonth() + 1}/${date.getDate()}`;
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
        dateFormat = date => {
          const weekNumber = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
          return `Week ${weekNumber}, ${date.getMonth() + 1}`;
        };
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 5); // Last 6 months
        dateFormat = date => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return monthNames[date.getMonth()];
        };
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        dateFormat = date => `${date.getMonth() + 1}/${date.getDate()}`;
    }
    
    // Initialize all dates in the range with zero sales
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateKey = dateFormat(currentDate);
      salesByDate[dateKey] = 0;
      
      // Increment date based on range
      if (dateRange === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (dateRange === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    // Fill in actual sales data
    salesData.forEach(sale => {
      const saleDate = new Date(sale.date);
      const dateKey = dateFormat(saleDate);
      
      if (salesByDate[dateKey] !== undefined) {
        salesByDate[dateKey] += sale.total;
      }
    });
    
    // Prepare chart data
    const labels = Object.keys(salesByDate);
    const data = Object.values(salesByDate);
    
    setTrendData({
      labels,
      datasets: [
        {
          label: 'Sales Trend',
          data,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.8)',
          tension: 0.1
        },
      ],
    });
  };

  const calculateTopProducts = (salesData) => {
    if (salesData.length === 0) {
      setTopProducts([]);
      return;
    }
    
    // Group sales by product
    const productSales = {};
    
    salesData.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    // Convert to array and sort by revenue
    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    setTopProducts(topProductsList);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="insights-page">
      <h1>Insights & Reports</h1>
      
      <div className="filter-controls" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="dateRange">Date Range</label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Daily (Last 7 days)</option>
            <option value="weekly">Weekly (Last 4 weeks)</option>
            <option value="monthly">Monthly (Last 6 months)</option>
          </select>
        </div>
        
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="categoryFilter">Filter by Category</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <div className="number">
            {formatCurrency(sales.reduce((total, sale) => total + sale.total, 0))}
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="number">{sales.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Order Value</h3>
          <div className="number">
            {sales.length > 0
              ? formatCurrency(sales.reduce((total, sale) => total + sale.total, 0) / sales.length)
              : '$0.00'}
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="number">{lowStockProducts.length}</div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="chart-container">
          <h2>Sales Trend</h2>
          {trendData ? (
            <Line 
              data={trendData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Sales Trend Over Time'
                  }
                }
              }}
            />
          ) : (
            <p>No data available for the selected period</p>
          )}
        </div>
        
        <div className="chart-container">
          <h2>Sales by Category</h2>
          {categoryData ? (
            <Pie 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Sales Distribution by Category'
                  }
                }
              }}
            />
          ) : (
            <p>No data available for the selected period</p>
          )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="chart-container">
          <h2>Top Selling Products</h2>
          {productData ? (
            <Bar 
              data={productData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Top Selling Products (Units)'
                  }
                }
              }}
            />
          ) : (
            <p>No data available for the selected period</p>
          )}
        </div>
        
        <div className="chart-container">
          <h2>Daily Sales</h2>
          {salesData ? (
            <Bar 
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Sales Amount by Date'
                  }
                }
              }}
            />
          ) : (
            <p>No data available for the selected period</p>
          )}
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Top Performing Products</h2>
        {topProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sales data available for the selected period</p>
        )}
      </div>
      
      <div className="card">
        <h2 className="card-title">Low Stock Alert</h2>
        {lowStockProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{getCategoryName(product.categoryId)}</td>
                  <td style={{ color: product.quantity <= 5 ? 'red' : 'orange' }}>
                    {product.quantity}
                  </td>
                  <td>
                    <a href="/inventory" className="btn">Update Stock</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No low stock items found</p>
        )}
      </div>
    </div>
  );
}

export default InsightsPage;