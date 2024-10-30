import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import styles from './salesChart.module.css';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = ({ dataset }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
    <div className={styles.salesChartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.subtitle}>Sales Chart</h2>
        <div className={styles.datePickers}>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>
      <div className={styles.chart}>
       <Line data={data} height={'135px'} />
      </div>
    </div>
  );
};

export default SalesChart;