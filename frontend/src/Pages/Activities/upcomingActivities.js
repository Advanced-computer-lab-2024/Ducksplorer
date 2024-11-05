import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Box, Button, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();  
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

  const handleBooking = async (activityId) => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }

      const type = 'activity';

      localStorage.setItem('activityId', activityId);
      localStorage.setItem('type', type);

      const response = await axios.get(`http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`);

      if (response.status === 200) {
        navigate('/payment');
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };
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
                <TableCell>Dates and Times</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Bookings</TableCell>
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
                  <TableCell>
                    {activity.date.length > 0
                      ? activity.date.map((dateTime, index) => {
                        const dateObj = new Date(dateTime);
                        const date = dateObj.toISOString().split('T')[0];
                        const time = dateObj.toTimeString().split(' ')[0];
                        return (
                          <div key={index}>
                            Date {index + 1}: {date}<br />
                            Time {index + 1}: {time}
                          </div>
                        );
                      })
                      : 'No available dates and times'}
                  </TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleBooking(activity._id)}>
                      Book Now
                    </Button>
                  </TableCell>
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
