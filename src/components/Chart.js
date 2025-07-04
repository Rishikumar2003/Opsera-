import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Chart({ 
  type = 'bar', 
  data, 
  options = {},
  height = 300
}) {
  // Default options for all chart types
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: options.title || '',
      },
    },
  };
  
  // Merge default options with provided options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Render the appropriate chart type
  const renderChart = () => {
    switch (type.toLowerCase()) {
      case 'line':
        return <Line data={data} options={chartOptions} height={height} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} height={height} />;
      case 'bar':
      default:
        return <Bar data={data} options={chartOptions} height={height} />;
    }
  };
  
  return (
    <div className="chart-container" style={{ height: `${height}px`, width: '100%' }}>
      {renderChart()}
    </div>
  );
}

export default Chart;