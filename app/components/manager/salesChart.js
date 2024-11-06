// salesChart.js

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import styles from './salesChart.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dataset, setDataset] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('Daily');
    const [selectedItem, setSelectedItem] = useState('');
    const [items, setItems] = useState([]);

    // Fetch items for the dropdown on component mount
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/items');
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await response.json();
                setItems(data.items);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Error fetching items. Please try again.');
            }
        };
        fetchItems();
    }, []);

    // Function to check if the selected time window is valid
    const isValidTimeWindow = (start, end) => {
        const today = new Date();
        return start <= end && start <= today && end <= today;
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            if (!isValidTimeWindow(startDate, endDate)) {
                setError('Invalid date range: Start date must be before end date, and dates cannot be in the future.');
                return;
            }

            if (!selectedItem) {
                setError('Please select an item.');
                return;
            }

            setError(null); // Clear any previous error messages

            try {
                const response = await fetch(
                    `/api/sales-chart?startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate
                        .toISOString()
                        .slice(0, 10)}&item=${encodeURIComponent(selectedItem)}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();

                // Process data to aggregate sales counts per selected time frame
                const aggregatedData = processSalesData(data.data, selectedTimeFrame);

                setDataset(aggregatedData);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setError('Error fetching sales data. Please try again.');
            }
        };

        fetchSalesData();
    }, [startDate, endDate, selectedTimeFrame, selectedItem]);

    // Function to process and aggregate sales data
    const processSalesData = (data, timeFrame) => {
        const salesCountMap = new Map();

        data.forEach((entry) => {
            // console.log('Entry:', entry);
            const dateOfSale = new Date(entry.date_of_sale.slice(0,10) + 'T' + entry.time_of_sale); // Combine date and time
            let key = '';
            // console.log(dateOfSale);

            switch (timeFrame) {
                case 'Hourly':
                    key = dateOfSale.toISOString().slice(0, 13) + ':00'; // YYYY-MM-DDTHH:00
                    break;
                case 'Daily':
                    key = dateOfSale.toISOString().slice(0, 10); // YYYY-MM-DD
                    break;
                case 'Weekly':
                    key = getWeekYear(dateOfSale); // e.g., "2023-W42"
                    break;
                case 'Monthly':
                    key = dateOfSale.toISOString().slice(0, 7); // YYYY-MM
                    break;
                case 'Yearly':
                    key = dateOfSale.getFullYear().toString(); // YYYY
                    break;
                default:
                    key = dateOfSale.toISOString().slice(0, 10);
            }

            salesCountMap.set(key, (salesCountMap.get(key) || 0) + 1);
        });

        // Convert the map to an array sorted by date
        return Array.from(salesCountMap)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([label, value]) => ({ label, value }));
    };

    // Helper function to get week number and year
    const getWeekYear = (date) => {

        if (!(date instanceof Date) || isNaN(date)) {
            console.error("Invalid date provided.");
            return null; // Return null or handle the error as needed
        }
        
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);
        console.log(`${date.getFullYear()}-W${weekNumber}`);

        return `${date.getFullYear()}-W${weekNumber}`;
    };

    const chartData = {
        labels: dataset.map((item) => item.label),
        datasets: [
            {
                label: `Total Sales for ${selectedItem}`,
                data: dataset.map((item) => item.value),
                borderColor: '#D22730',
                backgroundColor: 'rgba(210, 39, 48, 0.5)',
                fill: false,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit:
                        selectedTimeFrame === 'Hourly'
                            ? 'hour'
                            : selectedTimeFrame === 'Daily'
                                ? 'day'
                                : selectedTimeFrame === 'Weekly'
                                    ? 'week'
                                    : selectedTimeFrame === 'Monthly'
                                        ? 'month'
                                        : 'year',
                    tooltipFormat:
                        selectedTimeFrame === 'Hourly'
                            ? 'PPpp'
                            : selectedTimeFrame === 'Daily'
                                ? 'PP'
                                : selectedTimeFrame === 'Weekly'
                                    ? "yyyy-'W'II"
                                    : selectedTimeFrame === 'Monthly'
                                        ? 'MMM yyyy'
                                        : 'yyyy',
                    displayFormats: {
                        hour: 'MMM d, h a',
                        day: 'MMM d',
                        week: "yyyy-'W'II",
                        month: 'MMM yyyy',
                        year: 'yyyy',
                    },
                },
                adapters: {
                    date: {
                        locale: enUS,
                    },
                },
            },
        },
    };

    return (
        <div className={styles.salesChartContainer}>
            <div className={styles.chartHeader}>
                <h2 className={styles.subtitle}>Sales Chart</h2>
                <div className={styles.filters}>
                    <div className={styles.datePickers}>
                        <label>
                            Start Date:
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </label>
                        <label>
                            End Date:
                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                        </label>
                    </div>
                    <div className={styles.selects}>
                        <label>
                            Time Frame:
                            <select
                                value={selectedTimeFrame}
                                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                            >
                                <option value="Hourly">Hourly</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </label>
                        <label>
                            Item:
                            <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                                <option value="">Select an item</option>
                                {items.map((item, index) => (
                                    <option key={index} value={item.item_name}>
                                        {item.item_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.chart}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SalesChart;