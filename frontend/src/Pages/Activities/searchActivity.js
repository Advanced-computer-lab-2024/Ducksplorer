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
} from "@mui/material";
import ActivityCard from "../../Components/activityCard";
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
    <div >
      <TouristNavBar />
      <TouristSidebar />
      <Box
        sx={{
          // p: 6,
          maxWidth: "100%",
          overflowY: "visible",
          height: "100vh",
          marginLeft: 0,
          marginBottom: 20,
        }}
      >
        <Button
          component={Link}
          to={isGuest ? "/guestDashboard" : "/touristDashboard"}
          variant="solid"
          color="primary"
          style={{ marginBottom: "20px" }}
        >
          Back to Dashboard
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <h4 className="oswald-Titles">Activities</h4>
        </Box>

        {/* Search Form */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          {/* Single Search Bar */}
          {/* <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or tag"
            fullWidth
            sx={{ minWidth: 150 }}
          /> */}
          <Input
            color="primary"
            variant="outlined"
            placeholder="Search for an activity..."
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            size="lg"
          />

          {/* Search Button */}
          <Button
            variant="solid"
            color="primary"
            onClick={fetchSearchedActivities}
            sx={{ ml: 2 }}
          >
            Search
          </Button>
        </Box>

        {/* Activity Table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px", // Adjust the gap between items as needed
            paddingBottom: 24,
            
          }}
        >
          {
            activities.map((activity) =>
              activity.flag === false &&
              activity.advertiserDeleted === false &&
              activity.deletedActivity === false ? (
                <ActivityCard activity={activity} />
              ) : null
            ) // We don't output a row when it has `activity.flag` is true (ie activity is inappropriate) or when the activity's advertiser has left the system or the activity has been deleted but cannot be removed from database since it is booked my previous tourists
          }
        </div>
      </Box>
      <Help />
    </div>
  );
};

export default SearchActivities;
