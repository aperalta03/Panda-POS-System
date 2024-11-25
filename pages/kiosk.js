import React, { useState, useContext, useEffect } from "react";
import styles from "./kiosk.module.css";
import { useGlobalState } from "@/app/context/GlobalStateContext";
import { useRouter } from "next/router";
import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TranslateButton from "@/app/components/kiosk/translateButton";

// Menu structure
const menu = {
  appetizers: [
    { name: "Chicken Egg Roll", price: 2.5, calories: 200 },
    { name: "Vegetable Spring Roll", price: 2.5, calories: 190 },
    { name: "Cream Cheese Rangoon", price: 2.5, calories: 190 },
  ],
  sides: [
    { name: "Chow Mein", calories: 510 },
    { name: "Fried Rice", calories: 520 },
    { name: "Steamed White Rice", calories: 380 },
    { name: "Steamed Brown Rice", calories: 420 },
    { name: "Super Greens", calories: 90 },
  ],
  entrees: [
    { name: "Orange Chicken", count: 0, isPremium: false },
    { name: "Beijing Beef", count: 0, isPremium: false },
    { name: "Kung Pao Chicken", count: 0, isPremium: false },
    { name: "Broccoli Beef", count: 0, isPremium: false },
    { name: "Grilled Teriyaki Chicken", count: 0, isPremium: false },
    { name: "Mushroom Chicken", count: 0, isPremium: false },
    { name: "Honey Sesame Chicken Breast", count: 0, isPremium: false },
    { name: "Black Pepper Chicken", count: 0, isPremium: false },
    { name: "SweetFire Chicken Breast", count: 0, isPremium: false },
    { name: "String Bean Chicken Breast", count: 0, isPremium: false },
    { name: "Eggplant Tofu", count: 0, isPremium: false },
    { name: "Honey Walnut Shrimp", count: 0, isPremium: true },
    { name: "Black Pepper Angus Steak", count: 0, isPremium: true },
  ],
  seasonalItem: { name: "Special Seasonal Dish", price: 5.0, calories: 69 },
  prices: {
    bowl: 9.5,
    plate: 11.5,
    biggerPlate: 13.5,
    sides: 5.5,
    entrees: { standard: 6.5, premium: 8.5 },
    drinks: { small: 2.9, large: 3.9 },
    appetizers: 2.9,
  },
};

// Order item structures
class AlaCarteItem {
  constructor(item, quantity) {
    this.type = "A La Carte";
    this.item = item;
    this.quantity = quantity;
    this.price = item.isPremium
      ? menu.prices.entrees.premium
      : menu.prices.entrees.standard;
  }
}

class Appetizer {
  constructor(item, quantity) {
    this.type = "Appetizer";
    this.item = item;
    this.quantity = quantity;
    this.price = menu.prices.appetizers;
  }
}

class Drink {
  constructor(size) {
    this.type = "Drink";
    this.size = size;
    this.price =
      size === "small" ? menu.prices.drinks.small : menu.prices.drinks.large;
  }
}

class Meal {
  constructor(type, sides, entrees) {
    this.type = type;
    this.sides = sides;
    this.entrees = entrees;
    this.price = menu.prices[type.toLowerCase()];
  }
}

// Order structures
class Order {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  getExportableData() {
    return {
      items: this.items.map((item) => ({
        type: item.type,
        name: item.item?.name || item.size || item.type,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      totalPrice: this.getTotalPrice(),
    };
  }
}
/* 
  // Example Usage
  const order = new Order();
  
  // Adding items to the order
  order.addItem(new AlaCarteItem(menu.entrees[0], 2)); // e.g., 2 Orange Chickens
  order.addItem(new Appetizer(menu.appetizers[1], 1)); // 1 Vegetable Spring Roll
  order.addItem(new Drink("large"));
  order.addItem(new Meal("Bowl", [menu.sides[0]], [menu.entrees[2]]));
  
  // Accessing total price and exportable data
  console.log("Total Price:", order.getTotalPrice());
  console.log("Exportable Data:", order.getExportableData());
  */

const Welcome = ({ toItemPage }) => {
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  const [weather, setWeather] = useState({ temp: null, condition: null });
  const [time, setTime] = useState("");
  console.log("Kiosk test: ", translations["Tap to Order Now"]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://wttr.in/College+Station?format=%t+%C"
        );
        const data = await response.text();

        const match = data.match(/([+-]?\d+°[CF])\s+(.+)/);

        if (match) {
          const temp = match[1].replace("+", "");
          const condition = match[2];
          setWeather({ temp, condition });
        } else {
          console.error("Unexpected weather data format:", data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes("Sunny") || condition.includes("Clear"))
      return <WbSunnyIcon />;
    if (condition.includes("Partly cloudy")) return <CloudIcon />;
    if (condition.includes("Cloudy") || condition.includes("Overcast"))
      return <CloudIcon />;
    if (
      condition.includes("Rain") ||
      condition.includes("Showers") ||
      condition.includes("rain")
    )
      return <ThunderstormIcon />;
    if (condition.includes("Thunderstorm") || condition.includes("Thunder"))
      return <ThunderstormIcon />;
    if (condition.includes("Snow")) return <AcUnitIcon />;
    if (condition.includes("Windy") || condition.includes("Breezy"))
      return <AirIcon />;
    if (
      condition.includes("Fog") ||
      condition.includes("Mist") ||
      condition.includes("Haze")
    )
      return <CloudIcon />;
    return null;
  };

  return (
    <div className={styles.layout}>
      <div className={styles.clockLogoContainer}>
        {weather.temp && weather.condition && (
          <div className={styles.weatherBox}>
            <div className={styles.weatherIcon}>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className={styles.weatherTemp}>{weather.temp}</div>
          </div>
        )}
        <div className={styles.timestamp}>{time}</div>
      </div>
      <img
        src="/panda_express.png"
        alt="Panda Express Logo"
        className={styles.logo}
      />
      <h1 className={styles.welcomeHeader}>
        {translations["We Wok For You"] || "We Wok For You"}
      </h1>
      <div onClick={toItemPage} className={styles.orderHeader}>
        <h1>{translations["Tap to Order Now"] || "Tap to Order Now"}</h1>
      </div>
      <div className={styles.translateButton}>
        <TranslateButton
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      <div className={styles.handicapWrapper}>
        <img
          src="/handicap_button.jpg"
          alt="Handicap Logo"
          className={styles.accessibility}
        />
      </div>
      <div className={styles.circle}></div>
      <div className={styles.bottomPanel}></div>
    </div>
  );
};

const KioskPage = () => {
  const router = useRouter();

  const toItemPage = () => {
    router.push("/kiosk_item");
  };

  return (
    <div
      style={{
        height: "100vh", // Full height of the viewport
        overflow: "hidden", // Prevent scrolling
      }}
    >
      <Welcome toItemPage={toItemPage} />
    </div>
  );
};

export default KioskPage;
