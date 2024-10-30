// src/components/SalesChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // for 'category' scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ dataset }) => {
  const data = {
    labels: dataset.map(item => item.label),
    datasets: [{
      label: 'Sales',
      data: dataset.map(item => item.value),
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }],
  };

  return (
    <div>
      <h2>Sales Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default SalesChart;