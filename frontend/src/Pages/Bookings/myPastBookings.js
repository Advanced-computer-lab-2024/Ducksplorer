import React, { useEffect, useState } from "react";
import axios from "axios";
import TouristNavBar from "../../Components/TouristNavBar";
import {
  Box,
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
  CircularProgress,
  Chip
} from "@mui/material";
import MyChips from "../../Components/MyChips";
import { Link } from "react-router-dom";
import Help from "../../Components/HelpIcon";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";

const PastBookingDetails = () => {
  const userName = JSON.parse(localStorage.getItem("user")).username;
  //const [booking, setBooking] = useState(null);
  const [activityBookings, setActivityBookings] = useState(null);
  const [itineraryBookings, setItineraryBookings] = useState(null);
  const [selectedActivityRatings, setSelectedActivityRatings] = useState({});
  const [selectedItineraryRatings, setSelectedItineraryRatings] = useState({});
  const [activityComments, setActivityComments] = useState({});
  const [itineraryComments, setItineraryComments] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState("");
  const [tourGuideId, setSelectedTourGuideId] = useState(null);
  const [tourGuideNames, setTourGuideNames] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const chipNames = [
    "All",
    "Activities",
    "Itineraries",
  ];

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);
  };

  const fetchTourGuideName = async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tourGuideRate/getUserNameById/${bookingId}`
      );
      console.log("Tour Guide Name Response:", response.data);
      return response.data.userName;
    } catch (error) {
      console.error("Error fetching tour guide name:", error.message);
      return "N/A (Guide left the system)";
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myPastBookings`,
          { params: { tourist: userName } }
        );
        console.log("Activity Bookings Response:", response.data.activities);
        setActivityBookings(response.data.activities);

        console.log("Itinerary Bookings Response:", response.data.itineraries);
        setItineraryBookings(response.data.itineraries);

        const initialActivityRatings = {};
        activityBookings?.forEach((activityBooking) => {
          initialActivityRatings[activityBooking._id] =
            activityBooking.activity.averageRating;
        });
        setSelectedActivityRatings(initialActivityRatings);

        const initialItineraryRatings = {};
        itineraryBookings?.forEach((itineraryBooking) => {
          initialItineraryRatings[itineraryBooking._id] =
            itineraryBooking.averageRating || 0;
        });
        setSelectedItineraryRatings(initialItineraryRatings);

        const tourGuideNamesMap = {};
        for (const itineraryBooking of response.data.itineraries) {
          const tourGuideName = await fetchTourGuideName(itineraryBooking._id);
          tourGuideNamesMap[itineraryBooking._id] = tourGuideName;
        }
        setTourGuideNames(tourGuideNamesMap);
      } catch (error) {
        console.error(
          "Error fetching booking details:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setTimeout(() => setLoading(false), 1000); // Delay of 1 second
      }
    };
    fetchBooking();
  }, [userName]);

  const handleActivityRatingChange = async (bookingId, newRating) => {
    console.log(
      `Submitting rating for activity of booking ${bookingId}:`,
      newRating
    );
    try {
      const response = await axios.patch(
        `http://localhost:8000/activity/rate/${bookingId}`,
        { rating: newRating }
      );
      console.log("Rating response:", response.data);
      alert("Activity rating submitted successfully!");

      setSelectedActivityRatings((prevRatings) => ({
        ...prevRatings,
        [bookingId]: newRating,
      }));

      setActivityBookings((prevActivityBookings) =>
        prevActivityBookings.map(
          (activityBooking) =>
            activityBooking._id === bookingId
              ? { ...activityBooking, rating: newRating } // Update the rating for the specific booking
              : activityBooking // Keep other bookings unchanged
        )
      );
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

  const handleItineraryRatingChange = async (bookingId, newRating) => {
    console.log(
      `Submitting rating for booking for itinerary ${bookingId}:`,
      newRating
    );
    try {
      const response = await axios.patch(
        `http://localhost:8000/itinerary/rateItinerary/${bookingId}`,
        { rating: newRating }
      );
      console.log("Rating response:", response.data);
      alert("Itinerary rating submitted successfully!");

      setSelectedItineraryRatings((prevRatings) => ({
        ...prevRatings,
        [bookingId]: newRating,
      }));

      setItineraryBookings((prevItineraryBookings) =>
        prevItineraryBookings.map(
          (itineraryBooking) =>
            itineraryBooking._id === bookingId
              ? { ...itineraryBooking, rating: newRating } // Update the rating for the specific booking
              : itineraryBooking // Keep other bookings unchanged
        )
      );
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(
          `Failed to submit itinerary rating: ${error.response.data.message}`
        );
      } else {
        console.error("Error submitting itinerary rating:", error.message);
        alert("Failed to submit itinerary rating. Please try again.");
      }
    }
  };

  const handleActivityCommentChange = (bookingId, comment) => {
    setActivityComments((prev) => ({ ...prev, [bookingId]: comment }));
  };

  const handleActivityCommentSubmit = async (bookingId) => {
    try {
      await axios.patch(
        `http://localhost:8000/activity/commentActivity/${bookingId}`,
        {
          comment: activityComments[bookingId],
        }
      );
      alert("Comment submitted successfully!");
      setActivityComments((prev) => ({ ...prev, [bookingId]: "" })); // Clear the comment input after submission
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const handleItineraryCommentChange = (bookingId, comment) => {
    setItineraryComments((prev) => ({ ...prev, [bookingId]: comment }));
  };

  const handleItineraryCommentSubmit = async (bookingId) => {
    try {
      await axios.patch(
        `http://localhost:8000/itinerary/commentItinerary/${bookingId}`,
        {
          comment: itineraryComments[bookingId],
        }
      );
      alert("Comment submitted successfully!");
      setItineraryComments((prev) => ({ ...prev, [bookingId]: "" })); // Clear the comment input after submission
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

  const handleTourGuideRateSubmit = async () => {
    try {
      console.log("This is the tourguide id:", tourGuideId);
      await axios.patch(
        `http://localhost:8000/tourGuideRate/rateTourGuide/${tourGuideId}`,
        {
          rating: tourGuideRating,
        }
      );
      alert("Tour Guide rated successfully!");
      setTourGuideRating(0);
    } catch (error) {
      console.error("Error rating tour guide:", error.message);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const handleTourGuideCommentSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/tourGuideComment/commentTourGuide/${tourGuideId}`,
        {
          comment: tourGuideComment,
        }
      );
      alert("Comment submitted successfully!");
      setTourGuideComment("");
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const handleTourGuideSubmit = async () => {
    await handleTourGuideRateSubmit();
    await handleTourGuideCommentSubmit();
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Full screen height
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ mt: 2 }} variant="h6" color="text.secondary">
          Loading past bookings...
        </Typography>
      </Box>
    );
  }

  if ((!Array.isArray(activityBookings) && !Array.isArray(itineraryBookings)) || (activityBookings.length === 0 && itineraryBookings.length === 0)) {
    return <p>No booking details available.</p>;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f9f9f9",
        paddingTop: "64px", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <TouristSidebar />

      <div style={{ overflowY: "visible", height: "120vh", width: "85vw" }}>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 4, // Additional margin for better spacing
          }}
        >
          Bookings History
        </Typography>
        <br></br>
        <MyChips chipNames={chipNames} onChipClick={handleChipClick} />
        {(selectedCategory === "Activities" || selectedCategory === "All") && (
          <>
            {" "}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "#333", // Slightly darker color for better contrast
                textTransform: "capitalize",
                letterSpacing: "0.05em", // Slightly increased spacing for readability
                borderBottom: "3px solid #ddd", // Thicker and softer underline for modern design
                display: "inline-block",
                paddingBottom: "10px", // Slightly increased padding for better balance
                mb: 4, // More spacing below the title for separation
              }}
            >
              Activities
            </Typography>


            <TableContainer
              component={Paper}
              sx={{
                marginBottom: 4,
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    {[
                      "Name",
                      "Is Open",
                      "Advertiser",
                      "Date",
                      "Location",
                      "Price",
                      "Category",
                      "Tags",
                      "Special Discount",
                      "Duration",
                      "Rating",
                      "Rate",
                      "Comment",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 700,
                          textAlign: "center",
                          color: "#333",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityBookings.map((activityBooking) => (
                    <TableRow
                      key={activityBooking.activity._id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <TableCell>{activityBooking.activity.name}</TableCell>
                      <TableCell>
                        {activityBooking.activity.isOpen ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{activityBooking.activity.advertiser}</TableCell>
                      <TableCell>
                        {new Date(activityBooking.activity.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{activityBooking.activity.location}</TableCell>
                      <TableCell>{activityBooking.chosenPrice}</TableCell>
                      <TableCell>{activityBooking.activity.category}</TableCell>
                      <TableCell>
                        {activityBooking.activity.tags.join(", ")}
                      </TableCell>
                      <TableCell>
                        {activityBooking.activity.specialDiscount}%
                      </TableCell>
                      <TableCell>{activityBooking.activity.duration} mins</TableCell>
                      <TableCell>{activityBooking.rating}/5</TableCell>
                      <TableCell>
                        <Rating
                          name={`activity-rating-${activityBooking._id}`}
                          value={activityBooking.rating}
                          precision={0.5}
                          onChange={(event, newValue) =>
                            handleActivityRatingChange(activityBooking._id, newValue)
                          }
                          sx={{ color: "#FFD700" }} // Golden color for stars
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextField
                            variant="outlined"
                            size="small"
                            value={activityComments[activityBooking._id] || ""}
                            onChange={(e) =>
                              handleActivityCommentChange(
                                activityBooking._id,
                                e.target.value
                              )
                            }
                            placeholder="Add a comment"
                            sx={{
                              flexGrow: 1,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                          <Button
                            onClick={() =>
                              handleActivityCommentSubmit(activityBooking._id)
                            }
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Submit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {(selectedCategory === "Itineraries" ||
          selectedCategory === "All") && (
            <div>
              {" "}
              {/* Itineraries Table */}
              <Typography variant="h5" gutterBottom>
                Itineraries
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Activity Names</TableCell>
                      <TableCell>Locations</TableCell>
                      <TableCell>Timeline</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Available Dates & Times</TableCell>
                      <TableCell>Chosen Date</TableCell>
                      <TableCell>Accessibility</TableCell>
                      <TableCell>Pick-Up Location</TableCell>
                      <TableCell>Drop-Off Location</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Tour Guide</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itineraryBookings.map((itineraryBooking) => (
                      <TableRow key={itineraryBooking._id}>
                        <TableCell>{itineraryBooking.itinerary?.name || "Still doesn't have a name"}</TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary && Array.isArray(itineraryBooking.itinerary.activity)
                            ? itineraryBooking.itinerary.activity
                              .map((act) => act.name)
                              .join(", ")
                            : "No activities"}
                        </TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary && Array.isArray(itineraryBooking.itinerary.locations)
                            ? itineraryBooking.itinerary.locations.join(", ")
                            : "No locations"}
                        </TableCell>

                        <TableCell>{itineraryBooking.itinerary?.timeline}</TableCell>
                        <TableCell>{itineraryBooking.itinerary?.language}</TableCell>
                        <TableCell>{itineraryBooking?.chosenPrice}</TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary && Array.isArray(itineraryBooking.itinerary.availableDatesAndTimes) && itineraryBooking.itinerary.availableDatesAndTimes.length > 0
                            ? itineraryBooking.itinerary.availableDatesAndTimes
                              .map((date) => new Date(date).toLocaleDateString())
                              .join(", ")
                            : "No dates available"}
                        </TableCell>
                        <TableCell>
                          {new Date(itineraryBooking.chosenDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary?.accessibility}
                        </TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary?.pickUpLocation}
                        </TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary?.dropOffLocation}
                        </TableCell>
                        <TableCell>
                          {itineraryBooking.itinerary?.tags.join(", ")}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            {tourGuideNames[itineraryBooking._id] || "Loading..."}
                            <Button
                              onClick={() =>
                                handleOpenDialog(
                                  itineraryBooking.itinerary.tourGuideModel
                                )
                              }
                              variant="contained"
                              color="primary"
                              size="small"
                              style={{ marginTop: "5px" }}
                            >
                              Rate&Comment
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{itineraryBooking.rating}/5</TableCell>
                        <TableCell>
                          <Rating
                            name={`itinerary-rating-${itineraryBooking._id}`}
                            value={itineraryBooking.rating}
                            precision={0.5} // Set precision to 0.5 for half-star ratings
                            onChange={(event, newValue) =>
                              handleItineraryRatingChange(
                                itineraryBooking._id,
                                newValue
                              )
                            } // Pass the new value from the Rating component
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            size="small"
                            value={itineraryComments[itineraryBooking._id] || ""}
                            onChange={(e) =>
                              handleItineraryCommentChange(
                                itineraryBooking._id,
                                e.target.value
                              )
                            }
                            placeholder="Comment"
                          />
                          <Button
                            onClick={() =>
                              handleItineraryCommentSubmit(itineraryBooking._id)
                            }
                            variant="contained"
                            color="primary"
                            size="small"
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
          )}
        {/* Rating and Comment Dialog */}
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
        <Help />
      </div>
    </Box >
  );
};

export default PastBookingDetails;
