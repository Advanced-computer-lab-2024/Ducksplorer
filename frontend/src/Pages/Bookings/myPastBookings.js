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
  Rating
} from "@mui/material";

//const userId = localStorage.getItem("user"); // Replace "userId" with the actual key you used to store the user ID


const PastBookingDetails = ({ userName }) => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/touristRoutes/myPastBookings/${userName}`);
        console.log("Booking Response:", response);
        setBooking(response.data[0]);  // Access the first element of the data array
      } catch (error) {
        console.error("Error fetching booking details:", error.response ? error.response.data : error.message);
      }
    };
    fetchBooking();

  }, [userName]);

  // Check if booking is null or doesn't have the expected structure
  if (!booking) return <p>Loading...</p>;
  if (!Array.isArray(booking.activities) || !Array.isArray(booking.itineraries)) {
    return <p>No booking details available.</p>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>Bookings History</Typography>

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
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Special Discount</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Average Rating</TableCell>
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
                <TableCell>{activity.price}</TableCell>
                <TableCell>{activity.category}</TableCell>
                <TableCell>{activity.tags.join(", ")}</TableCell>
                <TableCell>{activity.specialDiscount}%</TableCell>
                <TableCell>{activity.duration} mins</TableCell>
                <TableCell><Rating
                  value={activity.averageRating}
                  precision={0.1}
                  readOnly
                /></TableCell>
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
              <TableCell>Price</TableCell>
              <TableCell>Available Dates & Times</TableCell>
              <TableCell>Accessibility</TableCell>
              <TableCell>Pick-Up Location</TableCell>
              <TableCell>Drop-Off Location</TableCell>
              <TableCell>Tour Guide</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booking.itineraries.map((itinerary) => (
              <TableRow key={itinerary._id}>
                <TableCell>{itinerary.activity.map(act => act.name).join(", ")}</TableCell>
                <TableCell>{itinerary.locations.join(", ")}</TableCell>
                <TableCell>{itinerary.timeline}</TableCell>
                <TableCell>{itinerary.language}</TableCell>
                <TableCell>{itinerary.price}</TableCell>
                <TableCell>{itinerary.availableDatesAndTimes.map(date => new Date(date).toLocaleDateString()).join(", ")}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


export default PastBookingDetails;
