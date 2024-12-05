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
  InputLabel,
  FormControl,
  Button,
  Rating,
  IconButton,
} from "@mui/material";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import ActivityCard from "../../Components/activityCard";
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

            console.log("hal heya saved: ", response.data);
            console.log("what is the status ", response.status);

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
    <div className="yassin fouda" style={{ width: "100%", marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        <FormControl >
          <Select
            indicator={<KeyboardArrowDown />}
            placeholder="Sort By"
            color="primary"
            onChange={(e, newValue) => {
              setSortBy(newValue);
            }}
            sx={{
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option value="date">Date</Option>
            <Option value="price">Price</Option>
            <Option value="name">Name</Option>
            <Option value="duration">Duration</Option>
            <Option value="category">Category</Option>
            <Option value="specialDiscount">Discount</Option>
            <Option value="averageRating">Rating</Option>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <Select
            labelId="order-label"
            placeholder="Order"
            onChange={(e, value) => {
              setOrder(value);
            }}
            color="primary"
            indicator={<KeyboardArrowDown />}
            sx={{
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={fetchSortedActivities}
        >
          Sort
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px", // Adjust the gap between items as needed
          width: "100%",
        }}
      >
        {activities.map((activity) =>
          activity.flag === false &&
            activity.advertiserDeleted === false &&
            activity.deletedActivity === false
            ? (console.log("this is the average rating ", activity.ratings[1]),
              (<ActivityCard activity={activity} />))
            : null
        )}
      </div>

      {/* <TableCell>
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
                    </span>  SAVED BY JAYDAA
                  </TableCell> */}
      <Help />
    </div >
  );
};

export default SortActivities;
