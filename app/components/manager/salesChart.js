import React, { useState, useEffect } from 'react';
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

const SalesChart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dataset, setDataset] = useState([]);
  const [error, setError] = useState(null);

  // Function to check if the selected time window is valid
  const isValidTimeWindow = (start, end) => {
    const today = new Date();
    return start < end && start <= today && end <= today;
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!isValidTimeWindow(startDate, endDate)) {
        setError('Invalid date range: Start date must be before end date, and dates cannot be in the future.');
        return;
      }
      
      setError(null); // Clear any previous error messages

      try {
        const response = await fetch(`/api/sales-chart?startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate.toISOString().slice(0, 10)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Transform the data into a format suitable for the chart
        const formattedData = data.data.map(entry => ({
          label: new Date(entry.sale_date).toLocaleDateString('en-US'), // Format as mm/dd/yyyy
          value: entry.total_sales,
        }));

        setDataset(formattedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data. Please try again.');
      }
    };

    fetchSalesData();
  }, [startDate, endDate]);

  const chartData = {
    labels: dataset.map(item => item.label),
    datasets: [{
      label: 'Total Sales',
      data: dataset.map(item => item.value),
      borderColor: '#D22730',
      backgroundColor: 'rgba(210, 39, 48, 0.5)',
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
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.chart}>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default SalesChart;