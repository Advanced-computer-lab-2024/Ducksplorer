import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);
  
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState('EGP');

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  
  // Handle fetching upcoming activities
  useEffect(() => {
    axios.get('http://localhost:8000/activity/upcoming')
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the activities!', error);
      });
  }, []);

  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Upcoming Activities</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price
                <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Is open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map(activity => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>                                            
                    {(activity.price * (exchangeRates[currency] || 1)).toFixed(2)} {currency}
                  </TableCell>
                  <TableCell>{activity.isOpen ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags}</TableCell>
                  <TableCell>{activity.specialDiscount}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default UpcomingActivities;
