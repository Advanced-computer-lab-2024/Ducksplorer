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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const PastBookingDetails = ({ userName }) => {
  const [booking, setBooking] = useState(null);
  const [selectedActivityRatings, setSelectedActivityRatings] = useState({});
  const [selectedItineraryRatings, setSelectedItineraryRatings] = useState({});
  const [activityComments, setActivityComments] = useState({});
  const [itineraryComments, setItineraryComments] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState("");
  const [tourGuideId, setSelectedTourGuideId] = useState(null);
  const [tourGuideNames, setTourGuideNames] = useState({});

  // Fetch tour guide names for each itinerary in the booking
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

        // Fetch tour guide names for all itineraries
        for (const itinerary of response.data[0].itineraries) {
          await fetchTourGuideName(itinerary.tourGuideModel);
        }
      } catch (error) {
        console.error(
          "Error fetching booking details:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchBooking();
  }, [userName]);

  const fetchTourGuideName = async (id) => {
    if (!id || tourGuideNames[id]) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/tourGuideRate/getUserNameById/${id}`
      );
      setTourGuideNames((prevNames) => ({
        ...prevNames,
        [id]: response.data.userName,
      }));
    } catch (error) {
      console.error(
        "Error fetching tour guide name:",
        error.response ? error.response.data : error.message
      );
      setTourGuideNames((prevNames) => ({
        ...prevNames,
        [id]: "N/A",
      }));
    }
  };

  if (!booking) return <p>Loading...</p>;
  if (!Array.isArray(booking.activities) || !Array.isArray(booking.itineraries)) {
    return <p>No booking details available.</p>;
  }

  const handleActivityRatingChange = async (activityId, newRating) => {
    console.log(`Submitting rating for activity ${activityId}:`, newRating);
    try {
      const response = await axios.patch(
        `http://localhost:8000/activity/rate/${activityId}`,
        { rating: newRating }
      );
      console.log("Rating response:", response.data);
      alert("Activity rating submitted successfully!");

      setSelectedActivityRatings((prevRatings) => ({
        ...prevRatings,
        [activityId]: newRating,
      }));

      setBooking((prevBooking) => ({
        ...prevBooking,
        activities: prevBooking.activities.map((activity) =>
          activity._id === activityId ? { ...activity, averageRating: newRating } : activity
        ),
      }));
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Failed to submit rating: ${error.response.data.message}`);
      } else {
        console.error("Error submitting rating:", error.message);
        alert("Failed to submit rating. Please try again.");
      }
    }
  };

  const handleItineraryRatingChange = async (itineraryId, newRating) => {
    console.log(`Submitting rating for itinerary ${itineraryId}:`, newRating);
    try {
      const response = await axios.patch(
        `http://localhost:8000/itinerary/rateItinerary/${itineraryId}`,
        { rating: newRating }
      );
      console.log("Rating response:", response.data);
      alert("Itinerary rating submitted successfully!");

      setSelectedItineraryRatings((prevRatings) => ({
        ...prevRatings,
        [itineraryId]: newRating,
      }));

      setBooking((prevBooking) => ({
        ...prevBooking,
        itineraries: prevBooking.itineraries.map((itinerary) =>
          itinerary._id === itineraryId ? { ...itinerary, averageRating: newRating } : itinerary
        ),
      }));
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Failed to submit itinerary rating: ${error.response.data.message}`);
      } else {
        console.error("Error submitting itinerary rating:", error.message);
        alert("Failed to submit itinerary rating. Please try again.");
      }
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

  const handleOpenDialog = (tourGuideId) => {
    setSelectedTourGuideId(tourGuideId);
    setOpenDialog(true);
  };

  const handleTourGuideRatingChange = (event, newValue) => {
    setTourGuideRating(newValue);
  };

  const handleTourGuideCommentChange = (event) => {
    setTourGuideComment(event.target.value);
  };

  const handleTourGuideSubmit = async () => {
    try {
      console.log("This is the tourguide id:", tourGuideId)
      const response = await axios.patch(
        `http://localhost:8000/tourGuideRate/rateTourGuide/${tourGuideId}`,
        {
          rating: tourGuideRating,
        }
      );
      alert("Tour Guide rated successfully!");
      setOpenDialog(false);
      setTourGuideRating(0);
      setTourGuideComment("");
    } catch (error) {
      console.error("Error rating tour guide:", error.message);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const getTourGuideId = async (id) => {
    try {
      if (!id) {
        return false;
      }
      const response = await axios.get(
        `http://localhost:8000/tourGuideRate/getTourGuideById/${id}`
      );
      console.log("Tour Guide Id Response:", response.data.present);
      return response.data.present;
    } catch (error) {
      console.error(
        "Error fetching tour guide id:",
        error.response ? error.response.data : error.message
      );
    }
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
                    placeholder="Comment"
                  />
                  <Button
                    onClick={() => handleActivityCommentSubmit(activity._id)}
                    variant="contained"
                    color="primary"
                    size="small"
                  style={{ marginLeft: '0px', marginTop: '5px' }}
                  >
                  Submit
                </Button>
              </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

      {/* Itineraries Table */ }
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
              <TableCell>Tags</TableCell>
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
                <TableCell>{itinerary.tags.join(", ")}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{tourGuideNames[itinerary.tourGuideModel] || "N/A"}</span>
                    <Button
                      onClick={() => handleOpenDialog(itinerary.tourGuideModel)}
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginTop: '5px' }}
                    >
                      Rate/Comment
                    </Button>
                  </div>
                </TableCell>
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
                <TableCell style={{width:"9%"}}>
                  <TextField
                    variant="outlined"
                    size="small"
                    marginright="0px"
                    fullWidth={true}
                    value={itineraryComments[itinerary._id] || ""}
                    onChange={(e) => handleItineraryCommentChange(itinerary._id, e.target.value)}
                    placeholder="Comment"
                    
                  />
                  <Button
                    onClick={() => handleItineraryCommentSubmit(itinerary._id)}
                    variant="contained"
                    color="primary"
                    size="small"
                    
                    style={{ marginLeft: '0px', marginTop: '5px' }}
                    >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  {/* Rating and Comment Dialog */ }
  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
    <DialogTitle>Rate Tour Guide</DialogTitle>
    <DialogContent>
      <Rating
        name="tour-guide-rating"
        value={tourGuideRating}
        onChange={handleTourGuideRatingChange}
        precision={1}
      />
      <TextField
        margin="dense"
        label="Comment"
        fullWidth
        multiline
        rows={3}
        value={tourGuideComment}
        onChange={handleTourGuideCommentChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)} color="secondary">
        Cancel
      </Button>
      <Button onClick={handleTourGuideSubmit} color="primary">
        Submit
      </Button>
    </DialogActions>
  </Dialog>
    </div >
  );
};

export default PastBookingDetails;