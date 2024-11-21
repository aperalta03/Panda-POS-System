import React, { useState, useEffect } from "react";
import ButtonGrid from "../app/components/cashier/buttonGrid";
import OrderPanel from "../app/components/cashier/orderPanel";
import BottomPanel from "../app/components/cashier/bottomPanel";
import styles from "./cashier.module.css";
import { useUser } from "../app/context/userProvider";

const CashierPage = () => {
  const { employeeID } = useUser();

  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const sides = ["Super Greens", "Chow Mein", "White Steamed Rice", "Fried Rice"];

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

  const handlePayClick = async () => {
    const now = new Date();
    const saleDate = now.toLocaleDateString('en-CA'); //need this for the correct time zone
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
    <div className={styles.mainContainer}>
      <div className={styles.layout}>
        <OrderPanel
          orders={orders}
          onDelete={deleteOrder}
        />
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
  );
};

export default CashierPage;