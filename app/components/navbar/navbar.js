import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRole } from '../../context/roleProvider';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Image from 'next/image';
import styles from './navbar.module.css';

const Navbar = () => {
    const { role, setRole } = useRole();
    const [time, setTime] = useState("");
    const [weather, setWeather] = useState({ temp: null, condition: null });
    const router = useRouter();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };
        updateTime();
        const timer = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("https://wttr.in/College+Station?format=%t+%C");
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
        if (condition.includes("Sunny") || condition.includes("Clear")) return <WbSunnyIcon />;
        if (condition.includes("Partly cloudy")) return <CloudIcon />;
        if (condition.includes("Cloudy") || condition.includes("Overcast")) return <CloudIcon />;
        if (condition.includes("Rain") || condition.includes("Showers") || condition.includes("rain")) return <ThunderstormIcon />;
        if (condition.includes("Thunderstorm") || condition.includes("Thunder")) return <ThunderstormIcon />;
        if (condition.includes("Snow")) return <AcUnitIcon />;
        if (condition.includes("Windy") || condition.includes("Breezy")) return <AirIcon />;
        if (condition.includes("Fog") || condition.includes("Mist") || condition.includes("Haze")) return <CloudIcon />;
        return null;
    };

    const handleLogoff = () => {
        setRole(null);
        localStorage.removeItem('role');
        router.push('/login-oauth');
    };

    const toggleView = () => {
        if (router.pathname === '/manager') {
            router.push('/cashier');
        } else if (router.pathname === '/kitchen') {
            router.push('/kitchenTV');
        } else if (router.pathname === '/kitchenTV') {
            router.push('/kitchen');
        } else {
            router.push('/manager');
        }
    };

    return (
        <div className={styles.mainContainer}>
            {/* Logoff Button */}
            <button
                className={`${styles.logoffButton} ${
                (role && router.pathname !== '/kiosk') || router.pathname === '/landing' ? styles.visible : ''
                }`}
                onClick={() => {
                if (router.pathname === '/landing') {
                    router.push('/login-oauth');
                } else {
                    router.push('/landing');
                }
                }}
                aria-label={router.pathname === '/landing' ? 'Log Out' : 'Back'}
            >
                {router.pathname === '/landing' ? 'Log Out' : 'Back'}
            </button>

            {/* Switch View Button */}
            <button
                className={`${styles.pageButton} ${
                    (role === 'manager' || router.pathname === '/kitchen' || router.pathname === '/kitchenTV') && router.pathname !== '/kiosk' && router.pathname !== '/menu'
                        ? styles.visible
                        : ''
                }`}
                onClick={toggleView}
            >
                Switch View
            </button>

            <h1 className={styles.title}>WELCOME TO PANDA EXPRESS</h1>

            <div className={styles.detailsBox}>
                <div className={styles.timestamp}>{time}</div>
                {weather.temp && weather.condition && (
                    <div className={styles.weatherBox}>
                        <div className={styles.weatherIcon}>{getWeatherIcon(weather.condition)}</div>
                        <div className={styles.weatherTemp}>{weather.temp}</div>
                    </div>
                )}
                <Image 
                    className={styles.logo} 
                    src='/chickenmaxxing_logo.png' 
                    alt="Chicken Maxxing Logo" 
                    width={100}
                    height={50} 
                />
            </div>
        </div>
    );
};

export default Navbar;