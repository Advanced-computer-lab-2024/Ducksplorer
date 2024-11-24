//This is the page that gets called when the sort activities button is clicked and it contains upcoming activities
import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Rating,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SortActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [isSaved, setIsSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  // Function to fetch sorted activities
  const fetchSortedActivities = () => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        if (showPreferences === "true") {
          let Activities = response.data;
          Activities = Activities.sort((a, b) => {
            if (a.category === favCategory && b.category !== favCategory) {
              return -1; // "restaurant" category comes first
            } else if (
              b.category === favCategory &&
              a.category !== favCategory
            ) {
              return 1; // Move other categories after "restaurant"
            } else {
              return 0; // If both have the same category, retain their relative order
            }
          });
          Activities = response.data.map((activity) => ({
            ...activity,
            saved: activity.saved || { isSaved: false, user: null },
          }));
          setActivities(Activities);
        } else {
          setActivities(response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Fetch activities on initial load
  useEffect(() => {
    // Fetch initial activities if needed
    fetchSortedActivities(); // Optional: Remove this line if you only want to load activities after clicking Sort
  }, []);

  const handleBooking = async (activityId) => {
    try {
      const userJson = localStorage.getItem("user");
      const isGuest = localStorage.getItem("guest") === "true";
      if (isGuest) {
        message.error("User is not logged in, Please login or sign up.");
        navigate("/guestDashboard");
        return;
      }
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }

      const type = "activity";

      localStorage.setItem("activityId", activityId);
      localStorage.setItem("type", type);

      const response = await axios.get(
        `http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`
      );

      if (response.status === 200) {
        navigate("/payment");
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  const handleSaveActivity = async (activityId, currentIsSaved) => {
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/activity/save/${activityId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        message.success("Activity saved successfully");
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity._id === activityId
              ? {
                  ...activity,
                  saved: { ...activity.saved, isSaved: newIsSaved },
                }
              : activity
          )
        );
      } else {
        message.error("Failed to save");
      }
      setIsSaved(isSaved);
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const [saveStates, setSaveStates] = useState({});

  useEffect(() => {
    const fetchSaveStates = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;

      const newSaveStates = {};
      await Promise.all(
        activities.map(async (activity) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/activity/getSave/${activity._id}/${userName}`
            );

            if (response.status === 200) {
              newSaveStates[activity._id] = response.data.saved; // Save the state
            }
          } catch (error) {
            console.error(
              `Failed to fetch save state for ${activity._id}:`,
              error
            );
          }
        })
      );

      setSaveStates(newSaveStates); // Update state with all fetched save states
    };

    if (activities.length > 0) {
      fetchSaveStates();
    }
  }, [activities]);

  return (
    <>
      <Box
        sx={{
          p: 6,
          maxWidth: "110vh",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Upcoming Activities</Typography>
        </Box>

        {/* Sorting Controls */}
        <Box
          sx={{
            display: "flex",
            overflowY: "visible",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="specialDiscount">Discount</MenuItem>
              <MenuItem value="averageRating">Rating</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="order-label">Order</InputLabel>
            <Select
              labelId="order-label"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={fetchSortedActivities}
          >
            Sort
          </Button>
        </Box>

        {/* Activity Table */}
        <TableContainer style={{ borderRadius: 20 }} component={Paper}>
          <Table
            style={{
              width: "100%",
              textAlign: "center",
              borderSpacing: "10px 5px",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Is open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Dates and Times</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Booking</TableCell>
                <TableCell>Bookmark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => activity.flag === false && activity.advertiserDeleted === false && activity.deletedActivity === false ? (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>
                    {(activity.price * (exchangeRates[currency] || 1)).toFixed(2)} {" "}
                  </TableCell>
                  <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags.join(", ")}</TableCell>
                  <TableCell>{activity.specialDiscount}</TableCell>
                  <TableCell>{activity.date ? (() => {
                    const dateObj = new Date(activity.date);
                    const date = dateObj.toISOString().split('T')[0];
                    const time = dateObj.toTimeString().split(' ')[0];
                    return (
                      <div>
                        {date} at {time}
                      </div>
                    );
                  })()
                    : 'No available date and time' ? (() => {
                      const dateObj = new Date(activity.date);
                      const date = dateObj.toISOString().split('T')[0];
                      const time = dateObj.toTimeString().split(' ')[0];
                      return (
                        <div>
                          {date} at {time}
                        </div>
                      );
                    })()
                      : 'No available date and time'}</TableCell>

                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>
                    <Rating value={activity.averageRating} precision={0.1} readOnly />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleBooking(activity._id)}>
                      Book Now
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() =>
                        handleSaveActivity(
                          activity._id,
                          activity.saved?.isSaved
                        )
                      }
                    >
                      {saveStates[activity._id] ? (
                        <IconButton>
                          <BookmarkIcon />
                        </IconButton>
                      ) : (
                        <IconButton>
                          <BookmarkBorderIcon />
                        </IconButton>
                      )}
                    </span>
                  </TableCell>

                </TableRow>
              ) : null) // We don't output a row when it has `activity.flag` is true (ie activity is inappropriate) or when the activity's advertiser has left the system or the activity has been deleted but cannot be removed from database since it is booked my previous tourists
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Help />
    </>
  );
};

export default SortActivities;
