import React, { createContext, useState, useEffect } from 'react';
import salesData from '/app/context/salesRecord.json';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders'));
    let orderCount = 1;
    const initialOrders = salesData
    //! Change to Cashier or Kiosk for Source of Orders.
      .filter((sale) => sale.source === 'Cashier')
      .flatMap((sale) =>
        sale.items.map((item) => {
          const orderId = `${sale.saleNumber}-${orderCount++}`;
          return {
            id: orderId,
            saleNumber: sale.saleNumber,
            orderNumber: orderCount - 1,
            date: sale.date,
            time: sale.time,
            totalPrice: sale.totalPrice,
            employeeID: sale.employeeID,
            plateSize: item.plateSize,
            items: item.items,
            status: 'not started',
          };
        })
      );

    if (!storedOrders || JSON.stringify(initialOrders) !== JSON.stringify(storedOrders)) {
      setOrders(initialOrders);
      localStorage.setItem('orders', JSON.stringify(initialOrders));
    } else {
      setOrders(storedOrders);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      if (newStatus === 'completed') {
        const completedOrders = updatedOrders.filter((order) => order.status === 'completed');
        if (completedOrders.length > 8) {
          const excessCompleted = completedOrders.length - 8;
          const ordersToRemove = completedOrders
            .slice(0, excessCompleted)
            .map((order) => order.id);
          return updatedOrders.filter((order) => !ordersToRemove.includes(order.id));
        }
      }

      return updatedOrders;
    });
  };

  const deleteOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  return (
    <OrdersContext.Provider value={{ orders, updateOrderStatus, deleteOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};