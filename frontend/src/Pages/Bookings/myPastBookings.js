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
  TextField,
  Button,
} from "@mui/material";

const PastBookingDetails = ({ userName }) => {
  const [booking, setBooking] = useState(null);
  const [selectedActivityRatings, setSelectedActivityRatings] = useState({});
  const [selectedItineraryRatings, setSelectedItineraryRatings] = useState({});
  const [activityComments, setActivityComments] = useState({});
  const [itineraryComments, setItineraryComments] = useState({});

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myPastBookings/${userName}`
        );
        console.log("Booking Response:", response.data);
        setBooking(response.data[0]);

        const initialActivityRatings = {};
        response.data[0]?.activities.forEach((activity) => {
          initialActivityRatings[activity._id] = activity.averageRating;
        });
        setSelectedActivityRatings(initialActivityRatings);

        const initialItineraryRatings = {};
        response.data[0]?.itineraries.forEach((itinerary) => {
          initialItineraryRatings[itinerary._id] = itinerary.averageRating || 0;
        });
        setSelectedItineraryRatings(initialItineraryRatings);
      } catch (error) {
        console.error(
          "Error fetching booking details:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchBooking();
  }, [userName]);

  const handleActivityRatingChange = async (activityId, newRating) => {
    try {
      await axios.patch(`http://localhost:8000/activity/rateActivity/${activityId}`, {
        rating: newRating,
      });
      setSelectedActivityRatings((prev) => ({
        ...prev,
        [activityId]: newRating,
      }));
    } catch (error) {
      console.error("Error rating activity:", error.message);
    }
  };

  const handleItineraryRatingChange = async (itineraryId, newRating) => {
    try {
      await axios.patch(`http://localhost:8000/itinerary/rateItinerary/${itineraryId}`, {
        rating: newRating,
      });
      setSelectedItineraryRatings((prev) => ({
        ...prev,
        [itineraryId]: newRating,
      }));
    } catch (error) {
      console.error("Error rating itinerary:", error.message);
    }
  };

  const handleActivityCommentChange = (activityId, comment) => {
    setActivityComments((prev) => ({ ...prev, [activityId]: comment }));
  };

  const handleActivityCommentSubmit = async (activityId) => {
    try {
      await axios.patch(`http://localhost:8000/activity/commentActivity/${activityId}`, {
        comment: activityComments[activityId],
      });
      alert("Comment submitted successfully!");
      setActivityComments((prev) => ({ ...prev, [activityId]: "" })); // Clear the comment input after submission
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const handleItineraryCommentChange = (itineraryId, comment) => {
    setItineraryComments((prev) => ({ ...prev, [itineraryId]: comment }));
  };

  const handleItineraryCommentSubmit = async (itineraryId) => {
    try {
      await axios.patch(`http://localhost:8000/itinerary/commentItinerary/${itineraryId}`, {
        comment: itineraryComments[itineraryId],
      });
      alert("Comment submitted successfully!");
      setItineraryComments((prev) => ({ ...prev, [itineraryId]: "" })); // Clear the comment input after submission
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to submit comment. Please try again.");
    }
  };

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
              <TableCell>Rate</TableCell>
              <TableCell>Comment</TableCell>
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
                <TableCell>{activity.averageRating}/5</TableCell>
                <TableCell>
                  <Rating
                    name={`activity-rating-${activity._id}`}
                    value={(selectedActivityRatings[activity._id] ?? activity.averageRating) || 0}
                    precision={1}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleActivityRatingChange(activity._id, newValue);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={activityComments[activity._id] || ""}
                    onChange={(e) => handleActivityCommentChange(activity._id, e.target.value)}
                    placeholder="Leave a comment"
                  />
                  <Button
                    onClick={() => handleActivityCommentSubmit(activity._id)}
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: '5px' }}
                  >
                    Submit
                  </Button>
                </TableCell>
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
              <TableCell>Average Rating</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booking.itineraries.map((itinerary) => (
              <TableRow key={itinerary._id}>
                <TableCell>{itinerary.activity.map((act) => act.name).join(", ")}</TableCell>
                <TableCell>{itinerary.locations.join(", ")}</TableCell>
                <TableCell>{itinerary.timeline}</TableCell>
                <TableCell>{itinerary.language}</TableCell>
                <TableCell>{itinerary.price}</TableCell>
                <TableCell>{itinerary.availableDatesAndTimes.map((date) => new Date(date).toLocaleDateString()).join(", ")}</TableCell>
                <TableCell>{itinerary.accessibility}</TableCell>
                <TableCell>{itinerary.pickUpLocation}</TableCell>
                <TableCell>{itinerary.dropOffLocation}</TableCell>
                <TableCell>{itinerary.tourGuideModel?.name || "N/A"}</TableCell>
                <TableCell>{itinerary.averageRating}/5</TableCell>
                <TableCell>
                  <Rating
                    name={`itinerary-rating-${itinerary._id}`}
                    value={(selectedItineraryRatings[itinerary._id] ?? itinerary.averageRating) || 0}
                    precision={1}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleItineraryRatingChange(itinerary._id, newValue);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={itineraryComments[itinerary._id] || ""}
                    onChange={(e) => handleItineraryCommentChange(itinerary._id, e.target.value)}
                    placeholder="Leave a comment"
                  />
                  <Button
                    onClick={() => handleItineraryCommentSubmit(itinerary._id)}
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: '5px' }}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PastBookingDetails;
