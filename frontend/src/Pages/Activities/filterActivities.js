//This is the page that gets called when the filter button is clicked inside the upcoming page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Rating,
  Slider,
  IconButton,
  Container,
} from "@mui/material";
import { message } from "antd";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const FilterActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]); // Store all activities
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [averageRating, setAverageRating] = useState(0); // Set default value to 0
  const [categories, setCategories] = useState([]); // Store fetched categories

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [isSaved, setIsSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  // Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });

    // Fetch all activities when component mounts
    // axios
    //   .get("http://localhost:8000/activity")
    //   .then((response) => {
    //     setAllActivities(response.data);
    //     setActivities(response.data); // Set initial activities to all
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the activities!", error);
    //   });
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/activity/upcoming"
        );
        const data = response.data.map((activity) => ({
          ...activity,
          saved: activity.saved || { isSaved: false, user: null },
        }));
        setAllActivities(data);
        setActivities(data);
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
    };
    fetchActivities();
  }, []);

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Function to fetch filtered activities
  const fetchFilteredActivities = () => {
    const query = new URLSearchParams({
      price,
      date,
      category,
    }).toString();

    axios
      .get(`http://localhost:8000/activity/filter?${query}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

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
          height: "100vh",
          backgroundColor: "#ffffff",
          paddingTop: "2vh", // Adjust for navbar height
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="700">
              Filter Activities
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px", // Adds space between the filter fields
            }}
          >
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ minWidth: 150 }}>
              <Typography variant="body1">Rating: {averageRating}</Typography>
              <Slider
                value={averageRating}
                onChange={(e, newValue) => setAverageRating(newValue)}
                step={1}
                marks={[0, 1, 2, 3, 4, 5].map((value) => ({
                  value,
                  label: value,
                }))}
                min={0}
                max={5}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={fetchFilteredActivities}
            >
              Filter
            </Button>
          </Box>

          {/* Activity Table */}
          <TableContainer style={{ borderRadius: 20 }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    Price
                    <CurrencyConvertor
                      onCurrencyChange={handleCurrencyChange}
                    />
                  </TableCell>
                  <TableCell>Is Open</TableCell>
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
                {
                  activities.map((activity) =>
                    activity.flag === false &&
                    activity.advertiserDeleted === false &&
                    activity.deletedActivity === false ? (
                      <TableRow key={activity._id}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>
                          {(
                            activity.price * (exchangeRates[currency] || 1)
                          ).toFixed(2)}{" "}
                          {currency}
                        </TableCell>
                        <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                        <TableCell>{activity.category}</TableCell>
                        <TableCell>{activity.tags.join(", ")}</TableCell>
                        <TableCell>{activity.specialDiscount}</TableCell>
                        <TableCell>
                          {activity.date
                            ? (() => {
                                const dateObj = new Date(activity.date);
                                const date = dateObj
                                  .toISOString()
                                  .split("T")[0];
                                const time = dateObj
                                  .toTimeString()
                                  .split(" ")[0];
                                return (
                                  <div>
                                    {date} at {time}
                                  </div>
                                );
                              })()
                            : "No available date and time"
                            ? (() => {
                                const dateObj = new Date(activity.date);
                                const date = dateObj
                                  .toISOString()
                                  .split("T")[0];
                                const time = dateObj
                                  .toTimeString()
                                  .split(" ")[0];
                                return (
                                  <div>
                                    {date} at {time}
                                  </div>
                                );
                              })()
                            : "No available date and time"}
                        </TableCell>
                        <TableCell>{activity.duration}</TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>
                          <Rating
                            value={activity.averageRating}
                            precision={0.1}
                            readOnly
                          />
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
                    ) : null
                  ) // We don't output a row when it has `activity.flag` is true (ie activity is inappropriate) or when the activity's advertiser has left the system or the activity has been deleted but cannot be removed from database since it is booked my previous tourists
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
};

export default FilterActivities;
