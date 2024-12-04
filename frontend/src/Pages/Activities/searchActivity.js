// This is the file that gets all the activities for the tourist
import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
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
  Rating,
  IconButton,
  Container,
  Grid,
} from "@mui/material";
import ActivityCard from "../../Components/activityCard";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

import { Link, useParams } from "react-router-dom";

// import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SearchActivities = () => {
  const { id } = useParams();

  const [activities, setActivities] = useState([]); // Displayed activities
  const [allActivities, setAllActivities] = useState([]); // Store all fetched activities
  const [searchQuery, setSearchQuery] = useState(""); // Single search input
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [isSaved, setIsSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  // Fetch all activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const favCategory = localStorage.getItem("category");
      console.log(showPreferences, favCategory);
      try {
        const response = await axios.get("http://localhost:8000/activity/", {
          params: {
            showPreferences: showPreferences.toString(),
            favCategory,
          },
        });
        const data = response.data.map((activity) => ({
          ...activity,
          saved: activity.saved || { isSaved: false, user: null },
        }));
        if (id === undefined) {
          setAllActivities(data);
          setActivities(data); // Set initial activities to all fetched activities
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setAllActivities(tempActivities);
          setActivities(tempActivities);
        }
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
    };
    fetchActivities();
  }, [id]);

  // Function to fetch activities based on search criteria
  const fetchSearchedActivities = () => {
    const query = new URLSearchParams({
      search: searchQuery, // Single search query sent to the backend
    }).toString();

    axios
      .get(`http://localhost:8000/activity?${query}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  // Share activity functionality
  const handleShareLink = (activityId) => {
    const link = `${window.location.origin}/activity/searchActivities/${activityId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (activityId) => {
    const link = `${window.location.origin}/activity/searchActivities/${activityId}`; // Update with your actual route
    const subject = "Check out this activity";
    const body = `Here is the link to the activity: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "fff6e6",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="duckTitle">
            Activities
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Input
            color="primary"
            variant="outlined"
            placeholder="Search for an activity..."
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            size="lg"
          />
          <Button
            variant="solid"
            color="primary"
            size="lg"
            onClick={fetchSearchedActivities}
            sx={{ ml: 2, backgroundColor: "orange" }}
          >
            Search
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(activities) && activities.length > 0 ? (
            activities.map((activity) =>
              activity.flag === false &&
                activity.advertiserDeleted === false &&
                activity.deletedActivity === false ? (
                <Grid item xs={12} sm={6} md={4} key={activity._id}>
                  <ActivityCard activity={activity} />
                </Grid>
              ) : null
            )
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No activities available
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
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
    </Box>
  );
};

export default SearchActivities;
