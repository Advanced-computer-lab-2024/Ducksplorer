import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, CardMedia, CardHeader, Avatar, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import CurrencyConverterGeneral from './CurrencyConverterGeneral'; // Adjust the import path as needed
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const HotelCards = ({ hotels , checkInDate, checkOutDate , adults , city , country }) => {
  const initialCurrency = 'USD';
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const navigate = useNavigate();

  //console.log(hotels);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const convertPriceToEgp = (price) => {
    if (!exchangeRates || !exchangeRates['EUR'] || !exchangeRates['EGP']) {
      return price;
    }
    const rate = exchangeRates['EGP'] / exchangeRates['EUR'];
    return (price * rate).toFixed(2);
  }

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
          // const titleNumber = titleMatch ? titleMatch[1] : '';
      const name = nameBefore ? nameBefore[2] : hotelBooking.title;
      
      
      const type = 'hotel';
      const hotel = {
        price : hotelBooking.priceForDisplay ? convertPriceToEgp(parseFloat(hotelBooking.priceForDisplay.replace('$', ''))) :(hotelBooking.priceSummary && extractPrice(hotelBooking.priceSummary) ),
        currency :'EGP',
        checkInDate : checkInDate,
        checkOutDate : checkOutDate,
        hotelName :name,
        city : city,
        country: country,
        rating : hotelBooking.bubbleRating.rating,
      }

      localStorage.setItem('hotel', JSON.stringify(hotel));
      localStorage.setItem('type', type);

      console.log(hotel);

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

  const handleImageSwipe = (index, direction) => {
    const newHotels = hotels;
    const currentHotel = newHotels[index];
    const totalImages = currentHotel.cardPhotos.length;

    if (direction === 'left') {
      currentHotel.currentImageIndex = (currentHotel.currentImageIndex - 1 + totalImages) % totalImages;
    } else if (direction === 'right') {
      currentHotel.currentImageIndex = (currentHotel.currentImageIndex + 1) % totalImages;
    }
  };

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

  const extractPrice = (priceString) => {
    const price = priceString.split('$')[1];
    return price ? price.trim() : 'N/A';
  };

  

  return (
    <Box sx={{ flexGrow: 1, mt: 4, overflowY: 'auto' }}>
      <CurrencyConverterGeneral onCurrencyChange={handleCurrencyChange} initialCurrency={currency} />
      <Grid container spacing={2} justifyContent="center">
        {hotels.map((hotel, index) => {
          if (!hotel.currentImageIndex) {
            hotel.currentImageIndex = 0;
          }
           
          const titleMatch = hotel.title.match(/^(\d+)\.\s*(.*)$/);
          // const titleNumber = titleMatch ? titleMatch[1] : '';
          const titleText = titleMatch ? titleMatch[2] : hotel.title;
          const avatarLetter = titleText.charAt(0);
          const isDuplicate = hotels.slice(0, index).some(h => {
            const hTitleMatch = h.title.match(/^(\d+)\.\s*(.*)$/);
            const hTitleText = hTitleMatch ? hTitleMatch[2] : h.title;
            return hTitleText === titleText;
          });
          if (isDuplicate) {
          return null;
          }

            return (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ borderRadius: 5, width: '100%', height: '100%', position: 'relative' }}>
              <CardHeader
              avatar={
              <Avatar aria-label="hotel">
              {avatarLetter}
              </Avatar>
              }
              title={`${titleText}`}
              />
              <Box sx={{ position: 'relative', overflow: 'hidden', '&:hover img': { opacity: 0.7, transition: 'opacity 0.3s ease-in-out' }}}>
              <CardMedia
              component="img"
              height="194"
              image={hotel.cardPhotos[hotel.currentImageIndex]?.sizes?.urlTemplate.split('?')[0] || "hotel1.jpg"}
              alt={`${hotel.title} image`}
              onError={(e) => { e.target.onerror = null; e.target.src = "hotel1.jpg"; }}
              onLoad={() => console.log(`Image loaded: ${hotel.cardPhotos[hotel.currentImageIndex]?.sizes?.urlTemplate.split('?')[0] || "hotel1.jpg"}`)}
              />
              <IconButton
              onClick={() => handleImageSwipe(index, 'left')}
              sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}
              >
              &lt;
              </IconButton>
              <IconButton
              onClick={() => handleImageSwipe(index, 'right')}
              sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
              >
              &gt;
              </IconButton>
              </Box>
              <CardContent>
              <Typography variant="body2" color="text.secondary">
              </Typography>
              <Typography variant="body2" color="text.secondary">
              
              </Typography>
              </CardContent>
              <div style={{ display: "flex", justifyContent: "center" }}>
              <IconButton aria-label="rating" sx={{ fontSize: 15 }}>
              <StarIcon sx={{ color: 'gold' }} /> {hotel.bubbleRating.rating} ({hotel.bubbleRating.count}){' ratings'}
              </IconButton>
              <IconButton aria-label="person" sx={{ fontSize: 15 }}>
              <PersonIcon /> 2
              </IconButton>
              <IconButton aria-label="booking" sx={{ fontSize: 15 }}>
              <PaymentIcon sx={{ color: 'green' }} /> {hotel.priceForDisplay ? convertPrice(parseFloat(hotel.priceForDisplay.replace('$', '')), 'USD') :(hotel.priceSummary && extractPrice(hotel.priceSummary) )|| 'N/A'} {currency}
              </IconButton>
              </div>
              <Button variant="contained" color="primary" fullWidth onClick={() => handleBooking(hotel)}>
              Book Hotel
              </Button>
              </Card>
            </Grid>
            );
        })}
      </Grid>
    </Box>
  );
};

export default HotelCards;