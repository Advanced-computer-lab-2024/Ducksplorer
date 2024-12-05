import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import CurrencyConverterGeneral from './CurrencyConverterGeneral';
import { Button } from '@mui/material';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const HotelsPage = () => {
  const [hotelsData, setHotelsData] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState('USD');
  const navigate = useNavigate();

  useEffect(() => {
    const storedHotelsData = localStorage.getItem('hotelsData');
    if (storedHotelsData) {
      setHotelsData(JSON.parse(storedHotelsData));
    }
  }, []);

  const handleCurrencyChange = useCallback((rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  }, []);

  const convertPrice = (price, fromCurrency) => {
    if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[currency]) {
      return price;
    }
    const rate = exchangeRates[currency] / exchangeRates[fromCurrency];
    return (price * rate).toFixed(2);
  };

  const handleBooking = async (hotelBooking) => {
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
      const nameBefore = hotelBooking.title.match(/^(\d+)\.\s*(.*)$/);
      const name = nameBefore ? nameBefore[2] : hotelBooking.title;

      const type = 'hotel';
      const hotel = {
        price: hotelBooking.priceForDisplay ? convertPrice(parseFloat(hotelBooking.priceForDisplay.replace('$', '')), 'USD') : (hotelBooking.priceSummary && extractPrice(hotelBooking.priceSummary)),
        currency: 'EGP',
        checkInDate: hotelsData.checkInDate,
        checkOutDate: hotelsData.checkOutDate,
        hotelName: name,
        city: hotelsData.city.label,
        country: hotelsData.city.country,
        rating: hotelBooking.bubbleRating.rating,
        image: hotelBooking.cardPhotos[0]?.sizes?.urlTemplate.split('?')[0] || "hotel1.jpg",
      }

      localStorage.setItem('hotel', JSON.stringify(hotel));
      localStorage.setItem('type', type);

      if (hotelBooking) {
        navigate('/payment');
      } else {
        message.error("Please Choose a hotel.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  if (!hotelsData) {
    return <div>Loading...</div>;
  }

  const { hotels } = hotelsData;

  return (
    <Box sx={{ flexGrow: 1, mt: 4, overflowY: 'visible', height: '60vh', marginLeft: 5 }}>
      <Typography variant="h6" component="div" sx={{ color: 'orange', textAlign: 'center', padding: 2 }}>
        Currency Converter
      </Typography>
      <CurrencyConverterGeneral onCurrencyChange={handleCurrencyChange} initialCurrency={currency} />
      <Grid container spacing={1} justifyContent="center">
        {hotels.map((hotel, index) => (
          <Grid item xs={12} sm={4} key={index} gap={"20px"} sx={{ mt: 2, overflowY: 'auto' }}>
            <Card
              onClick={() => handleBooking(hotel)}
              variant="outlined"
              className="activity-card"
              sx={{
                width: "30vw",
                height: "400px",
                cursor: "pointer",
              }}
            >
              <CardOverflow>
                <CardContent sx={{ padding: 2 }}>
                  <Typography variant="h6" component="div" sx={{ textAlign: 'center', padding: 2 }}>
                    {hotel.title}
                  </Typography>
                  {hotel.priceForDisplay && (
                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 2 }}>
                      Price: {convertPrice(parseFloat(hotel.priceForDisplay.replace('$', '')), 'USD')} {currency}
                    </Typography>
                  )}
                  <Button variant="contained" onClick={() => handleBooking(hotel)} sx={{ mt: 2, backgroundColor: "#ff9933" }} fullWidth>
                    Book Hotel Now
                  </Button>
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HotelsPage;
