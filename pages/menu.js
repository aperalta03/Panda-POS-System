import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import Image from 'next/image';
import styles from './menu.module.css';

import Head from "next/head"; // Import Head for managing the document head

/**
 * Menu Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Displays categorized menu items for customers, including seasonal items.
 *
 * @features
 * - Categorized view of menu items (appetizers, sides, entrees, etc.).
 * - Seasonal item section with dynamic updates.
 * - Detailed nutritional and pricing information.
 *
 * @api
 * - `/api/menu-get-items` (GET): Fetches menu items and seasonal item details.
 *
 * @returns {React.ReactElement} A React functional component.
 */

const Menu = () => {

  const [menuItems, setMenuItems] = useState({ appetizers: [], sides: [], entrees: [] });
  const [seasonalItem, setSeasonalItem] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu-get-items');
        const data = await response.json();

        if (response.ok) {
          const categorizedMenu = {
            appetizers: [],
            sides: [],
            entrees: [],
          };

          data.menuItems.forEach((item) => {
            if (item.type === 'appetizer') {
              categorizedMenu.appetizers.push(item);
            } else if (item.type === 'side') {
              categorizedMenu.sides.push(item);
            } else if (item.type === 'entree') {
              categorizedMenu.entrees.push(item);
            } else if (item.type === 'seasonal') {
              setSeasonalItem(item);
            }
          });

          setMenuItems(categorizedMenu);
        } else {
          console.error('Error fetching menu items:', data.error);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <>
    <Head>
      {/* Add or update the page title */}
      <title>Menu Board</title>
      {/* Add other metadata if needed */}
      <meta name="description" content="View all items within the menu board" />
    </Head>
    <Box className={styles.menuContainer}>
      <Grid container spacing={0} display={"flex"} flexDirection={"row"}>
        {/* Left Column */}
        <Grid item xs={12} md={6.5}>
          {/* Bowl Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Box className={styles.menuItemTitle}>
                <Typography variant="h4" className={styles.sectionTitle}>BOWL</Typography>
                <Typography variant="h5" className={styles.price}>$9.50</Typography>
              </Box>
              <Box className={styles.sectionTextBox}>
                <Typography variant="body1" className={styles.sectionText}>
                    1 Entrees + Side(s) <br />
                </Typography>
                <Typography variant="body1" className={styles.sectionText}>
                    240 - 1010 cal
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
          </Box>

          {/* Plate Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Box className={styles.menuItemTitle}>
                <Typography variant="h4" className={styles.sectionTitle}>PLATE</Typography>
                <Typography variant="h5" className={styles.price}>$11.50</Typography>
              </Box>
              <Box className={styles.sectionTextBox}>
                <Typography variant="body1" className={styles.sectionText}>
                    2 Entrees + Side(s) <br />
                </Typography>
                <Typography variant="body1" className={styles.sectionText}>
                    240 - 1010 cal
                </Typography>
               </Box>
            </Box>
            <Divider className={styles.divider} />
          </Box>

          {/* Bigger Plate Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Box className={styles.menuItemTitle}>
                <Typography variant="h4" className={styles.sectionTitle}>BIGGER PLATE</Typography>
                <Typography variant="h5" className={styles.price}>$13.50</Typography>
              </Box>
              <Box className={styles.sectionTextBox}>
                <Typography variant="body1" className={styles.sectionText}>
                    3 Entrees + Side(s) <br />
                </Typography>
                <Typography variant="body1" className={styles.sectionText}>
                    240 - 1010 cal
                </Typography>
               </Box>
            </Box>
            <Divider className={styles.divider} />
          </Box>

            {/* A La Carte Section */}
            <Box className={styles.menuSection}>
                <Box className={styles.menuItem}>
                <Typography variant="h4" className={styles.sectionTitle}>A LA CARTE</Typography>
                <Typography variant="h5" className={styles.price}>Price Varies</Typography>
                </Box>
                <Divider className={styles.divider} />
            </Box>

          {/* Appetizers Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Typography variant="h4" className={styles.sectionTitle}>APPETIZERS</Typography>
              <Typography variant="h5" className={styles.price}>$2.90</Typography>
            </Box>
            <Divider className={styles.divider} />
          </Box>

          {/* Sides Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
                <Typography variant="h4" className={styles.sectionTitle}>SIDES</Typography>
                <Typography variant="h5" className={styles.price}>$5.50</Typography>
            </Box>
            <Divider className={styles.divider} />
          </Box>

          {/* Entrees Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Box minWidth="100%" className={styles.menuItemTitle}>
                <Typography variant="h4" className={styles.sectionTitleBig}>ENTREE | PREMIUM</Typography>
                <Typography variant="h5" className={styles.price}>$6.50 | $8.50</Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
          </Box>

          {/* Drinks Section */}
          <Box className={styles.menuSection}>
            <Box className={styles.menuItem}>
              <Box minWidth="100%" className={styles.menuItemTitle}>
                <Typography variant="h4"  className={styles.sectionTitleBig}>DRINK | FOUNTAIN</Typography>
                <Typography variant="h5" className={styles.price}>$2.90 | $3.90</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Vertical Divider */}
        <Grid item xs={12} md={1}>
            <Divider orientation="vertical" flexItem className={styles.verticalDivider} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>

          {/* Appetizers Section */}
          <Box className={styles.menuSection}>
            <Typography variant="h4" className={styles.sectionTitle}>APPETIZERS</Typography>
            {menuItems.appetizers.map((item, index) => (
              <Box key={index} className={styles.menuItem}>
                <Typography variant="h5" className={styles.itemName}>{item.name}</Typography>
                <Typography variant="body2" className={styles.calories}>{item.calories} cal</Typography>
              </Box>
            ))}
            <Divider className={styles.divider} />
          </Box>

          {/* Sides Section */}
          <Box className={styles.menuSection}>
            <Typography variant="h4" className={styles.sectionTitle}>SIDES</Typography>
            {menuItems.sides.map((item, index) => (
              <Box key={index} className={styles.menuItem}>
                <Typography variant="h5" className={styles.itemName}>{item.name}</Typography>
                <Typography variant="body2" className={styles.calories}>{item.calories} cal</Typography>
              </Box>
            ))}
            <Divider className={styles.divider} />
          </Box>

          {/* Entrees Section */}
          <Box className={styles.menuSection}>
            <Typography variant="h4" className={styles.sectionTitle}>ENTREES</Typography>
            {menuItems.entrees.map((item, index) => (
              <Box key={index} className={styles.menuItem}>
                <Typography
                  variant="h5"
                  className={`${styles.itemName}  ${item.designation === 'Premium' ? styles.premium : ''}`}
                >
                  {item.name}
                </Typography>
                <Typography variant="body2" className={styles.calories}>{item.calories} cal</Typography>
              </Box>
            ))}
            <Divider className={styles.divider} />
          </Box>

          {/* Seasonal Menu Item Section */}
          <Box className={styles.menuSection}>
            <Typography variant="h4" className={styles.sectionTitle}>SEASONAL</Typography>
            {seasonalItem ? (
              <Box className={styles.seasonalBox}>
                <Box className={styles.seasonalItem}>
                  <Typography variant="h5" className={styles.itemName}>
                    {seasonalItem.name}
                  </Typography>
                  <Typography variant="h5" className={styles.itemName}>
                    ${seasonalItem.price}
                  </Typography>
                  <Typography variant="body2" className={styles.calories}>{seasonalItem.calories} cal</Typography>
                </Box>
                <Image src="/specialoffer.png" width={200} height={200} className={styles.seasonalImage} />
              </Box>
            ) : (
              <Typography variant="body1">Seasonal item not available.</Typography>
            )}
          </Box>
          
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Menu;
