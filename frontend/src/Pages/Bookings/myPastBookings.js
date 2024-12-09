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
  Chip,
} from "@mui/material";
import MyTabs from "../../Components/MyTabs";
import { Link } from "react-router-dom";
import Help from "../../Components/HelpIcon";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import DuckLoading from "../../Components/Loading/duckLoading";
import { message } from "statuses";

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

  const [selectedTab, setSelectedTab] = useState("All");
  const tabNames = ["All", "Activities", "Itineraries"];


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
      message.success("Activity rating submitted successfully!");

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
      message.success("Itinerary rating submitted successfully!");

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
      message.success("Tour Guide rated successfully!");
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
      message.success("Comment submitted successfully!");
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
      <div>
        <DuckLoading />
      </div>
    );
  }

  if (
    (!Array.isArray(activityBookings) && !Array.isArray(itineraryBookings)) ||
    (activityBookings.length === 0 && itineraryBookings.length === 0)
  ) {
    return (
      <>
        <TouristNavBar />
        <p
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          No booking details available.
        </p>
      </>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
      }}
    >
      <TouristNavBar />

      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
      >
        <div style={{ overflowY: "visible", height: "100vh" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            class="bigTitle"
            gutterBottom
          >
            Past Bookings History
          </Typography>
          <br></br>
          <MyTabs tabNames={tabNames} onTabClick={(tabName) => setSelectedTab(tabName)} />
          {(selectedTab === "Activities" ||
            selectedTab === "All") && (
              <>
                {" "}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: "20px" }}
                  gutterBottom
                >
                  Activities
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    marginBottom: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    borderRadius: "1.5cap",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
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
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityBookings.map((activityBooking) => (
                        <TableRow key={activityBooking.activity._id}>
                          <TableCell>{activityBooking.activity.name}</TableCell>
                          <TableCell>
                            {activityBooking.activity.isOpen ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity.advertiser}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              activityBooking.activity.date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity.location}
                          </TableCell>
                          <TableCell>{activityBooking.chosenPrice}</TableCell>
                          <TableCell>
                            {activityBooking.activity.category}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity &&
                              activityBooking.activity.tags?.length
                              ? activityBooking.activity.tags.join(", ")
                              : "No tags available"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity.specialDiscount}%
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity.duration} mins
                          </TableCell>
                          <TableCell>{activityBooking.rating}/5</TableCell>
                          <TableCell>
                            <Rating
                              name={`activity-rating-${activityBooking._id}`}
                              value={activityBooking.rating}
                              precision={0.5}
                              onChange={(event, newValue) =>
                                handleActivityRatingChange(
                                  activityBooking._id,
                                  newValue
                                )
                              }
                              sx={{ color: "#FFD700" }} // Golden color for stars
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <TextField
                                variant="outlined"
                                size="small"
                                width="auto"
                                value={
                                  activityComments[activityBooking._id] || ""
                                }
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
                                className="blackhover"
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
          {(selectedTab === "Itineraries" ||
            selectedTab === "All") && (
              <div>
                {" "}
                {/* Itineraries Table */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: "20px" }}
                  gutterBottom
                >
                  Itineraries
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    marginBottom: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    borderRadius: "1.5cap",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Activity Names
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Language
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Price
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Available Dates & Times
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Chosen Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Pick-Up Location
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Drop-Off Location
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          {" "}
                          Tags
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Tour Guide
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Rating
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Rate
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Comment
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itineraryBookings.map((itineraryBooking) => (
                        <TableRow key={itineraryBooking._id}>
                          <TableCell>
                            {itineraryBooking.itinerary?.name ||
                              "Still doesn't have a name"}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              Array.isArray(itineraryBooking.itinerary.activity)
                              ? itineraryBooking.itinerary.activity
                                .map((act) => act.name)
                                .join(", ")
                              : "No activities"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary?.language}
                          </TableCell>
                          <TableCell>{itineraryBooking?.chosenPrice}</TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              Array.isArray(
                                itineraryBooking.itinerary.availableDatesAndTimes
                              ) &&
                              itineraryBooking.itinerary.availableDatesAndTimes
                                .length > 0
                              ? itineraryBooking.itinerary.availableDatesAndTimes
                                .map((date) =>
                                  new Date(date).toLocaleDateString()
                                )
                                .join(", ")
                              : "No dates available"}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              itineraryBooking.chosenDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary?.pickUpLocation}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary?.dropOffLocation}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.tags?.length
                              ? itineraryBooking.itinerary.tags.join(", ")
                              : "No tags available"}
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", flexDirection: "column" }}
                            >
                              {tourGuideNames[itineraryBooking._id] ||
                                "Loading..."}
                              <Button
                                onClick={() =>
                                  handleOpenDialog(
                                    itineraryBooking.itinerary.tourGuideModel
                                  )
                                }
                                className="blackhover"
                                variant="contained"
                                size="small"
                                style={{ marginTop: "5px" }}
                              >
                                Rate & Comment
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
                              value={
                                itineraryComments[itineraryBooking._id] || ""
                              }
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
                              className="blackhover"
                              size="small"
                              style={{ color: "white" }}
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
        </div>

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
            <Button
              onClick={() => setOpenDialog(false)}
              className="blackhover"
              style={{ color: "white" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTourGuideSubmit}
              className="blackhover"
              style={{ color: "white" }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Help />
      </div>
    </Box>
  );
};

export default PastBookingDetails;
