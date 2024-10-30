import React from 'react';
import styles from './salesChart.module.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
    <div className= {styles.salesChartContainer}> {/* Add this class */}
      <h2>Sales Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default SalesChart;
