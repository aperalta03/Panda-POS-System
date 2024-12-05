import React, { useState, useEffect } from "react";
import ButtonGrid from "../app/components/cashier/buttonGrid";
import OrderPanel from "../app/components/cashier/orderPanel";
import BottomPanel from "../app/components/cashier/bottomPanel";
import styles from "./cashier.module.css";
import { useUser } from "../app/context/userProvider";

import Head from "next/head"; // Import Head for managing the document head

/**
 * @description
 * Renders the cashier interface for managing orders, including menu items, order panel, and payment processing.
 * Utilizes state hooks to track menu items, order quantities, net cost, and more. Fetches menu data on component mount
 * and provides functionality to add, delete, and process orders.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.user - The user object containing employee information, including `employeeID`.
 * @param {Array<Object>} props.menuItems - List of menu items fetched from the server, each containing `name` and `price`.
 * @param {number} props.netCost - The current net cost of the orders placed, calculated dynamically.
 * @param {Object<string, number>} props.quantities - Map of item names to their current quantities in the order.
 * @param {Object<string, number>} props.priceMap - Map of item names to their respective prices.
 * @param {Array<Object>} props.orders - Array of objects representing current orders with plate sizes and their components.
 * @param {Object<string, number>} props.minQuantities - Map of item names to their minimum required quantities for the order.
 * @param {boolean} props.seasonalItemActive - Indicates if the seasonal item is currently active.
 *
 * @returns {JSX.Element} The rendered cashier page component.
 * 
 * @example
 * // Usage example
 * <CashierPage user={userObject} menuItems={menuItemsArray} netCost={100.0} quantities={quantitiesMap} priceMap={priceMap} orders={ordersArray} minQuantities={minQuantitiesMap} seasonalItemActive={true} />
 *
 * @module cashier
 */

const CashierPage = () => {
  const { employeeID } = useUser();

  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const sides = [
    "Super Greens",
    "Chow Mein",
    "White Steamed Rice",
    "Fried Rice",
  ];

  const [menuItems, setMenuItems] = useState([]);
  const [netCost, setNetCost] = useState(0.0);
  const [quantities, setQuantities] = useState({});
  const [priceMap, setPriceMap] = useState({});
  const [orders, setOrders] = useState([]);
  const [minQuantities, setMinQuantities] = useState({});
  const [seasonalItemActive, setSeasonalItemActive] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/cashier-getMenu");
        const data = await response.json();

        const prices = {};
        const quantitiesInit = {};
        data.data.forEach(({ name, price }) => {
          prices[name] = price;
          quantitiesInit[name] = 0;
        });

        setPriceMap(prices);
        setQuantities(quantitiesInit);
        setMenuItems(data.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  /**
   * Handles the payment process by creating an orderDetails object with the
   * current sale information and sending it to the server to update the sales record.
   * If the order is successfully saved, it resets the net cost, item quantities, and orders.
   *
   * @async
   * @function handlePayClick
   * @returns {void} Shows an alert if order details are incomplete or if there is an error during the fetch.
   *
   * @throws {Error} Logs an error if the order fails to save or if there is an error during the fetch.
   *
   * @param {number} netCost - The current net cost of the orders.
   * @param {number} employeeID - The ID of the employee processing the order.
   * @param {Array<Object>} orders - The array of current orders with plate sizes and components.
   *
   * @author Brandon Batac
   * @author Uzair Khan
   */
  const handlePayClick = async () => {
    const now = new Date();
    const saleDate = now.toLocaleDateString("en-CA"); //need this for the correct time zone
    const saleTime = now.toTimeString().split(" ")[0];
    console.log(saleDate);
    const orderDetails = {
      saleDate,
      saleTime,
      totalPrice: (netCost + netCost * 0.0625).toFixed(2),
      employeeID,
      orders: orders,
      source: "Cashier",
    };

    if (!saleDate || !saleTime || !employeeID || !orderDetails.orders.length) {
      console.error("Missing critical order details:", {
        saleDate,
        saleTime,
        employeeID,
        orders: orderDetails.orders,
      });
      alert("Order details are incomplete. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/updateSalesRecord`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        }
      );

      if (response.ok) {
        console.log("Order saved successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to save order", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setNetCost(0);
    setQuantities(
      Object.keys(quantities).reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
    );
    setOrders([]);
  };

  /**
   * Updates the orders array with a new order and updates the minimum
   * quantities of each item in the order.
   * @function addOrderToPanel
   * @param {string} plateSize - The size of the plate for the order.
   * @param {Array<string>} components - The components of the order.
   *
   * @returns {void} Updates the orders array and the minimum quantities of each item.
   *
   * @author Brandon Batac, Uzair Khan
   */
  const addOrderToPanel = (plateSize, components) => {
    setOrders((prevOrders) => [...prevOrders, { plateSize, components }]);

    setMinQuantities((prevMin) => {
      const updatedMin = { ...prevMin };

      components.forEach((item) => {
        if (sides.includes(item)) {
          updatedMin[item] = (updatedMin[item] || 0) + 0.5;
        } else {
          updatedMin[item] = (updatedMin[item] || 0) + 1;
        }
      });

      return updatedMin;
    });
  };

  /**
   * Deletes an order from the orders array and updates the net cost, quantities,
   * and minimum quantities of each item accordingly.
   * @function deleteOrder
   *
   * @param {number} index - The index of the order to delete in the orders array.
   *
   * @returns {void} Updates the orders array, net cost, quantities, and minimum quantities.
   *
   * @author Brandon Batac, Uzair Khan
   */
  const deleteOrder = (index) => {
    const orderToDelete = orders[index];
    const orderCost =
      orderToDelete.plateSize === "A La Carte"
        ? orderToDelete.components.reduce(
            (total, item) => total + priceMap[item],
            0
          )
        : priceMap[orderToDelete.plateSize];

    setNetCost((prev) => prev - orderCost);

    const updatedQuantities = { ...quantities };
    const updatedMinQuantities = { ...minQuantities };

    if (plateSizes.includes(orderToDelete.plateSize)) {
      updatedQuantities[orderToDelete.plateSize] = Math.max(
        (updatedQuantities[orderToDelete.plateSize] || 0) - 1,
        0
      );
    }

    orderToDelete.components.forEach((item) => {
      if (sides.includes(item)) {
        updatedQuantities[item] = Math.max(
          (updatedQuantities[item] || 0) - 0.5,
          0
        );
        updatedMinQuantities[item] = Math.max(
          (updatedMinQuantities[item] || 0) - 0.5,
          0
        );
      } else {
        updatedQuantities[item] = Math.max(
          (updatedQuantities[item] || 0) - 1,
          0
        );
        updatedMinQuantities[item] = Math.max(
          (updatedMinQuantities[item] || 0) - 1,
          0
        );
      }
    });

    setQuantities(updatedQuantities);
    setMinQuantities(updatedMinQuantities);
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const handleSeasonalAddDelete = () => {
    setSeasonalItemActive(!seasonalItemActive);
  };

  return (
    <>
    <Head>
      {/* Add or update the page title */}
      <title>Cashier Order View</title>
      {/* Add other metadata if needed */}
      <meta name="description" content="Cashiers may create orders and proccess payments for customers" />
    </Head>
    <div className={styles.mainContainer}>
      <div className={styles.layout}>
        <OrderPanel orders={orders} onDelete={deleteOrder} />
        <ButtonGrid
          setNetCost={setNetCost}
          priceMap={priceMap}
          quantities={quantities}
          setQuantities={setQuantities}
          addOrderToPanel={addOrderToPanel}
          minQuantities={minQuantities}
          sides={sides}
          menuItems={menuItems}
        />
      </div>
      <BottomPanel
        netCost={netCost}
        handlePayClick={handlePayClick}
        priceMap={priceMap}
        setPriceMap={setPriceMap}
        setQuantities={setQuantities}
        seasonalItemActive={seasonalItemActive}
      />
    </div>
    </>
  );
};

export default CashierPage;
