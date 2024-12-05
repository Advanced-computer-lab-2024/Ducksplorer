import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Grid, IconButton, Tooltip } from '@mui/material';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import StarIcon from '@mui/icons-material/Star';
import CurrencyConverterGeneral from './CurrencyConverterGeneral'; // Adjust the import path as needed
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Add from '@mui/icons-material/Bookmark';
import Done from '@mui/icons-material/Done';
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';

const HotelCards = ({ hotels, checkInDate, checkOutDate, adults, city, country }) => {
  const initialCurrency = 'USD';
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const navigate = useNavigate();

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
      const name = nameBefore ? nameBefore[2] : hotelBooking.title;

      const type = 'hotel';
      const hotel = {
        price: hotelBooking.priceForDisplay ? convertPriceToEgp(parseFloat(hotelBooking.priceForDisplay.replace('$', ''))) : (hotelBooking.priceSummary && extractPrice(hotelBooking.priceSummary)),
        currency: 'EGP',
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        hotelName: name,
        city: city,
        country: country,
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

  const handleShareLink = (hotelId) => {
    const link = `${window.location.origin}/hotel/${hotelId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (hotelId) => {
    const link = `${window.location.origin}/hotel/${hotelId}`; // Update with your actual route
    const subject = "Check out this hotel";
    const body = `Here is the link to the hotel: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleClick = (event, hotelId) => {
    event.stopPropagation();
    Swal.fire({
      title: "Share Hotel",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <button id="share-link" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Link
          </button>
          <button id="share-mail" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Mail
          </button>
        </div>
      `,
      showConfirmButton: false, // Hide default OK button
      width: "400px", // Set the width of the popup
      padding: "20px", // Add padding to the popup
      customClass: {
        popup: "my-swal-popup", // Optional: Add custom styling via CSS
      },
    });

    // Add click event listeners for custom buttons
    document.getElementById("share-link").addEventListener("click", () => {
      console.log("Sharing via link...");
      handleShareLink(hotelId);
      Swal.fire("Link copied to clipboard!", "", "success");
    });

    document.getElementById("share-mail").addEventListener("click", () => {
      console.log("Sharing via mail...");
      handleShareEmail(hotelId);
      // Swal.fire("Shared via Mail!", "", "success");
    });
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4, overflowY: 'visible' , height:"90vh" }}>
       <Typography variant="h6" component="div" sx={{ color: 'orange', textAlign: 'center', padding: 2 }}>
          Currency Converter
        </Typography>
        <div style={{marginBottom:"20px"}}>
      <CurrencyConverterGeneral onCurrencyChange={handleCurrencyChange} initialCurrency={currency} style={{marginBottom:"20px"}} />
      </div>
      <Grid container spacing={1} justifyContent="center">
        {hotels.map((hotel, index) => {
          if (!hotel.currentImageIndex) {
            hotel.currentImageIndex = 0;
          }

          const titleMatch = hotel.title.match(/^(\d+)\.\s*(.*)$/);
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
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
              onClick={() => handleBooking(hotel)}
              variant="outlined"
              className="activity-card"
              sx={{
                width: "90%",
                height: "350px",
                cursor: "pointer",
                margin: "0 auto",
              }}
              >
              <Box sx={{ position: 'relative', overflow: 'hidden', '&:hover img': { opacity: 0.7, transition: 'opacity 0.3s ease-in-out' } }}>
                <img
                src={hotel.cardPhotos[hotel.currentImageIndex]?.sizes?.urlTemplate.split('?')[0] || "hotel1.jpg"}
                alt={`${hotel.title} image`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = "hotel1.jpg"; }}
                onLoad={() => console.log(`Image loaded: ${hotel.cardPhotos[hotel.currentImageIndex]?.sizes?.urlTemplate.split('?')[0] || "hotel1.jpg"}`)}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" color="text.secondary" align="center">
                {titleText}
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
                <PaymentIcon sx={{ color: 'green' }} /> {hotel.priceForDisplay ? convertPrice(parseFloat(hotel.priceForDisplay.replace('$', '')), 'USD') : (hotel.priceSummary && extractPrice(hotel.priceSummary)) || 'N/A'} {currency}
                </IconButton>
              </div>
              <Button variant="contained" sx={{backgroundColor:"#ff9933"}} fullWidth onClick={() => handleBooking(hotel)}>
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