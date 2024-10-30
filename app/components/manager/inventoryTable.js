import React, { useState, useEffect } from 'react';
import style from './inventoryTable.module.css';

const InventoryTable = () => {
  const [inventoryData, setInventoryData] = useState([]);

  return (
    <div className={style.mainContainer}>
      <table className={style.InventoryTable}> {/* Apply class here */}
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
    </div>
  );
};

export default InventoryTable;
