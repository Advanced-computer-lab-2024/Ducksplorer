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
  Button,
  Rating,
} from "@mui/material";

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
      backgroundColor: "#f9f9f9",
      paddingTop: "64px", // Adjust for navbar height
    }}
  >
     <TouristNavBar />
     <TouristSidebar/>
     <Box
        sx={{
          // p: 6,
          maxWidth: "150vh",
          overflowY: "visible",
          height: "110vh",
          marginLeft: 0,
        }}
      >
        <Button
          component={Link}
          to={isGuest ? "/guestDashboard" : "/touristDashboard"}
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px" }}
        >
          Back to Dashboard
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Search Activities</Typography>
        </Box>

        {/* Search Form */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          {/* Single Search Bar */}
          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or tag"
            fullWidth
            sx={{ minWidth: 150 }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={fetchSearchedActivities}
            sx={{ ml: 2 }}
          >
            Search
          </Button>
        </Box>

        {/* Activity Table */}
        <TableContainer component={Paper} style={{ borderRadius: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Is Open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Dates and Times</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => activity.flag===false && activity.advertiserDeleted===false && activity.deletedActivity===false? (
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
                              const date = dateObj.toISOString().split("T")[0];
                              const time = dateObj.toTimeString().split(" ")[0];
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
                      {id === undefined ? (
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleShareLink(activity._id)}
                          >
                            Share Via Link
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleShareEmail(activity._id)}
                          >
                            Share Via Email
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ):null)// We don't output a row when it has `activity.flag` is true (ie activity is inappropriate) or when the activity's advertiser has left the system or the activity has been deleted but cannot be removed from database since it is booked my previous tourists
                }
                 </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Help />
    </Box>
  );
};

export default SearchActivities;
