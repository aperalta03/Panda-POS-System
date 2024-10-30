// src/components/SalesReport.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchReport = () => {
    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = endDate.toISOString().split('T')[0];

    // // Fetch report data (replace with your endpoint)
    // fetch(`/api/sales-report?start=${formattedStart}&end=${formattedEnd}`)
    //   .then(response => response.json())
    //   .then(data => console.log("Report Data:", data))
    //   .catch(error => console.error("Error fetching report data:", error));
  };

  return (
    <div>
      <h2>Generate Sales Report</h2>
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      <button onClick={fetchReport}>Get Sales Report</button>
    </div>
  );
};

export default SalesReport;