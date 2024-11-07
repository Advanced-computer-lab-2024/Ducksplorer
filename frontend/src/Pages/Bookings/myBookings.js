import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Rating,
  Tooltip,
  IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { message } from 'antd';
import TouristNavBar from "../../Components/TouristNavBar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";


const BookingDetails = () => {
  const userName = JSON.parse(localStorage.getItem("user")).username
  const [booking, setBooking] = useState(null);
  const [exchangeRatesAc, setExchangeRatesAc] = useState({});
  const [currencyAc, setCurrencyAc] = useState('EGP');
  const [exchangeRatesIt, setExchangeRatesIt] = useState({});
  const [currencyIt, setCurrencyIt] = useState('EGP');

  const handleCurrencyChangeAc = (rates, selectedCurrency) => {
    setExchangeRatesAc(rates);
    setCurrencyAc(selectedCurrency);
  };

  const handleCurrencyChangeIt = (rates, selectedCurrency) => {
    setExchangeRatesIt(rates);
    setCurrencyIt(selectedCurrency);
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/touristRoutes/booking/${userName}`);
        console.log("Booking Response:", response);
        setBooking(response.data[0]);  // Access the first element of the data array
      } catch (error) {
        console.error("Error fetching booking details:", error.response ? error.response.data : error.message);
      }
    };
    fetchBooking();

  }, [userName]);

  const handleDeleteBooking = async (type, itemId, price) => {
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
    const userName = user.username;

    try {
      const response = await axios.patch(`http://localhost:8000/touristRoutes/booking/${userName}`, {
        type,
        itemId,
        price
      });

      if (response.status === 200) {
        message.success(response.data.message);

        // Remove the item from the state (either activity or itinerary)
        setBooking((prevBooking) => {
          const updatedBooking = { ...prevBooking };

          if (type === 'activity') {
            updatedBooking.activities = updatedBooking.activities.filter((activity) => activity._id !== itemId);
          } else if (type === 'itinerary') {
            updatedBooking.itineraries = updatedBooking.itineraries.filter((itinerary) => itinerary._id !== itemId);
          }

          return updatedBooking;
        });
      } else {
        message.error(response.data.message || "Failed to delete booking item.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("You can't cancel the booking within 48 hours or after the start of the activity/itinerary");
    }
  };


  if (!booking) return <p>Loading...</p>;
  if (!Array.isArray(booking.activities) || !Array.isArray(booking.itineraries)) {
    return <p>No booking details available.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <div style={{ overflowY: 'visible', height: '100vh' }}>
        <Typography variant="h4" gutterBottom>Booking Details</Typography>

        {/* Activities Table */}
        <Typography variant="h5" gutterBottom>Activities</Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Is Open</TableCell>
                <TableCell>Advertiser</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price
                  <CurrencyConvertor onCurrencyChange={handleCurrencyChangeAc} />
                </TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Special Discount</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {booking.activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                  <TableCell>{activity.advertiser}</TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>
                    {(activity.price * (exchangeRatesAc[currencyAc] || 1)).toFixed(2)} {currencyAc}
                  </TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags.join(", ")}</TableCell>
                  <TableCell>{activity.specialDiscount}%</TableCell>
                  <TableCell>{activity.duration} mins</TableCell>
                  <TableCell><Rating
                    value={activity.averageRating}
                    precision={0.1}
                    readOnly
                  /></TableCell>
                  <TableCell>
                    <Tooltip title="Delete Itinerary">
                      <IconButton color="error" aria-label="delete category" onClick={() => handleDeleteBooking('activity', activity._id, activity.price)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Itineraries Table */}
        <Typography variant="h5" gutterBottom>Itineraries</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity Names</TableCell>
                <TableCell>Locations</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Price<CurrencyConvertor onCurrencyChange={handleCurrencyChangeIt} />
                </TableCell>
                <TableCell>Available Dates & Times</TableCell>
                <TableCell>Chosen Date</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Pick-Up Location</TableCell>
                <TableCell>Drop-Off Location</TableCell>
                <TableCell>Tour Guide</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {booking.itineraries.map((itinerary) => (
                <TableRow key={itinerary._id}>
                  <TableCell>{itinerary.activity.map(act => act.name).join(", ")}</TableCell>
                  <TableCell>{itinerary.locations.join(", ")}</TableCell>
                  <TableCell>{itinerary.timeline}</TableCell>
                  <TableCell>{itinerary.language}</TableCell>
                  <TableCell>
                    {(itinerary.price * (exchangeRatesIt[currencyIt] || 1)).toFixed(2)} {currencyIt}
                  </TableCell>
                  <TableCell>{itinerary.availableDatesAndTimes.map(date => new Date(date).toLocaleDateString()).join(", ")}</TableCell>
                  <TableCell>{itinerary.chosenDate}</TableCell>
                  <TableCell>{itinerary.accessibility}</TableCell>
                  <TableCell>{itinerary.pickUpLocation}</TableCell>
                  <TableCell>{itinerary.dropOffLocation}</TableCell>
                  <TableCell>{itinerary.tourGuideModel?.name || "N/A"}</TableCell>
                  <TableCell><Rating
                    value={itinerary.rating}
                    precision={0.1}
                    readOnly
                  /></TableCell>
                  <TableCell>{itinerary.tags.join(", ")}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Itinerary">
                      <IconButton color="error" aria-label="delete category" onClick={() => handleDeleteBooking('itinerary', itinerary._id, itinerary.price)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};


export default BookingDetails;
