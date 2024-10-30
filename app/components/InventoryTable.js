// src/components/InventoryTable.js
import React, { useState, useEffect } from 'react';

const InventoryTable = () => {
  const [inventoryData, setInventoryData] = useState([]);

  // useEffect(() => {
  //   // Fetch inventory data from API (replace with your endpoint)
  //   fetch('/api/inventory')
  //     .then(response => response.json())
  //     .then(data => setInventoryData(data))
  //     .catch(error => console.error("Error fetching data: ", error));
  // }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Item Name</th>
          <th>Stocked</th>
          <th>Required</th>
          <th>To Order</th>
        </tr>
      </thead>
      <tbody>
        {inventoryData.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.stocked}</td>
            <td>{item.required}</td>
            <td>{item.toOrder}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;