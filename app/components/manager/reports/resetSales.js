import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
} from '@mui/material';
import styles from './resetSales.module.css';

const DeleteSales = () => {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [useToday, setUseToday] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [queryType, setQueryType] = useState(''); // 'id' or 'date'
  const [deleteSaleId, setDeleteSaleId] = useState(''); // For specific sale ID deletion

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startId: queryType === 'id' ? startId : null,
          endId: queryType === 'id' ? endId : null,
          date: queryType === 'date' ? (useToday ? new Date().toISOString().split('T')[0] : selectedDate) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }

      const data = await response.json();
      setSalesData(data.sales);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      alert('Failed to fetch sales data');
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      const response = await fetch('/api/deleteSale', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleNumber: saleId }),
      });

      if (response.ok) {
        alert('Sale deleted successfully');
        setSalesData(salesData.filter((sale) => sale.sale_number !== saleId));
      } else {
        alert('Failed to delete sale');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Error deleting sale');
    }
  };

  const handleResetSalesData = async () => {
    try {
      const response = await fetch('/api/reset-salesRecord', { method: 'POST' });
      if (response.ok) {
        alert('Sales data reset successfully');
      } else {
        alert('Failed to reset sales data');
      }
    } catch (error) {
      console.error('Error resetting sales data:', error);
      alert('Error resetting sales data');
    }
  };

  return (
    <Box className={styles.modalBox}>
      <Typography className={styles.modalTitle} variant="h5" gutterBottom>
        Delete Sales
      </Typography>
      <Box display="flex" alignItems="flex-start" gap={4}>
        {/* Left Section: ID Range */}
        <Box className={styles.scrollableContent} flex={1}>
          <Typography variant="h6">Sales ID Range</Typography>
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <TextField
              label="Start ID"
              value={startId}
              onChange={(e) => {
                setStartId(e.target.value);
                setQueryType('id');
              }}
              disabled={queryType === 'date'}
              fullWidth
            />
            <Typography>to</Typography>
            <TextField
              label="End ID"
              value={endId}
              onChange={(e) => {
                setEndId(e.target.value);
                setQueryType('id');
              }}
              disabled={queryType === 'date'}
              fullWidth
            />
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Right Section: Native Date Picker */}
        <Box className={styles.scrollableContent} flex={1}>
          <Typography variant="h6">Date</Typography>
          <Box mt={2}>
            <Checkbox
              checked={useToday}
              onChange={(e) => {
                setUseToday(e.target.checked);
                setQueryType('date');
              }}
              disabled={queryType === 'id'}
            />
            Today
          </Box>
          {!useToday && (
            <Box mt={2}>
              <label>
                <Typography>Select Date</Typography>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setQueryType('date');
                  }}
                  disabled={queryType === 'id'}
                  className={styles.nativeDatePicker}
                />
              </label>
            </Box>
          )}
        </Box>
      </Box>

      <Button className={styles.closeButton} variant="contained" onClick={handleSearch} sx={{ mt: 3 }}>
        Search
      </Button>

      {/* Results Table */}
      <Table className={styles.reportTable} sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Sale ID</TableCell>
            <TableCell>Item Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesData.map((sale) => (
            <React.Fragment key={sale.sale_number}>
              <TableRow onClick={() => setExpandedRow(expandedRow === sale.sale_number ? null : sale.sale_number)}>
                <TableCell>{sale.sale_number}</TableCell>
                <TableCell>{sale.item_type}</TableCell>
              </TableRow>
              {expandedRow === sale.sale_number && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Collapse in={expandedRow === sale.sale_number}>
                      <Typography variant="subtitle1">Items:</Typography>
                      <ul>
                        {sale.items && sale.items.length > 0 ? (
                          sale.items.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                          <Typography variant="body2">No items available for this sale.</Typography>
                        )}
                      </ul>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Divider and Delete Sale by ID */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Delete Sale by ID</Typography>
      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <TextField
          label="Sale ID"
          value={deleteSaleId}
          onChange={(e) => setDeleteSaleId(e.target.value)}
          fullWidth
        />
        <Button
          className={styles.closeButton}
          variant="contained"
          color="error"
          onClick={() => handleDeleteSale(deleteSaleId)}
        >
          Delete
        </Button>
      </Box>

      {/* Divider and Reset Sales Data */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Reset Daily Sales Data</Typography>
      <Typography variant="body2" gutterBottom>
        This will clear all sales records for the current day.
      </Typography>
      <Button
        className={styles.closeButton}
        variant="contained"
        color="error"
        onClick={handleResetSalesData}
      >
        Reset Data
      </Button>
    </Box>
  );
};

export default DeleteSales;