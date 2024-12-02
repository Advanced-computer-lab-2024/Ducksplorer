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
  Container,
  Grid,
} from "@mui/material";
import ActivityCard from "../activityCard";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

import { Link, useParams } from "react-router-dom";

// import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";

const SearchActivities = () => {
  const { id } = useParams();

  const [activities, setActivities] = useState([]); // Displayed activities
  const [allActivities, setAllActivities] = useState([]); // Store all fetched activities
  const [searchQuery, setSearchQuery] = useState(""); // Single search input
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  // Fetch all activities when component mounts
  useEffect(() => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    console.log(showPreferences, favCategory);
    axios
      .get("http://localhost:8000/activity/", {
        params: {
          showPreferences: showPreferences.toString(),
          favCategory,
        },
      })
      .then((response) => {
        if (id === undefined) {
          setAllActivities(response.data);
          setActivities(response.data); // Set initial activities to all fetched activities
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setAllActivities(tempActivities);
          setActivities(tempActivities);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
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
  // Share itinerary functionality
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

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            All Available Activities
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
            onClick={fetchSearchedActivities}
            sx={{ ml: 2 }}
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
      <Help />
    </Box>
  );
};

export default SearchActivities;
