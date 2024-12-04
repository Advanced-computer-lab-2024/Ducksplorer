import React, { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Rating,
  Tooltip,
  CircularProgress
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CurrencyConvertor from "../Components/CurrencyConvertor.js";
import MyChips from "../Components/MyChips.js";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import TouristNavBar from "../Components/TouristNavBar.js";
import TouristSidebar from "../Components/Sidebars/TouristSidebar.js";

function MySavedItems() {
  const { id } = useParams();

  const chipNames = ["All", "Itineraries", "Activities"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [itineraries, setItineraries] = useState([]);

  const [activities, setActivities] = useState([]); // Displayed activities

  const [isSaved, setIsSaved] = useState(false);
  const [isSavedActivity, setIsSavedActivity] = useState(false);

  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);
  };

  useEffect(() => {
    const fetchItineraries = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const user = JSON.parse(localStorage.getItem("user"));

      const username = user?.username;
      const role = user?.role;
      try {
        setLoadingItinerary(true);
        const response = await axios.get("http://localhost:8000/itinerary/", {
          params: {
            showPreferences: showPreferences.toString(),
            username,
            role,
          },
        });
        const data = response.data.map((itinerary) => ({
          ...itinerary,
          saved: itinerary.saved || { isSaved: false, user: null },
        }));
        if (id === undefined) {
          setItineraries(data);
        } else {
          const tempItineraries = data.filter(
            (itinerary) => itinerary._id === id
          );
          setItineraries(tempItineraries);
        }
      } catch (error) {
        console.error("There was an error fetching the itineraries!", error);
      }
      finally {
        setLoadingItinerary(false);
      }
    };
    fetchItineraries();
  }, [id]);

  useEffect(() => {
    const fetchActivities = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const favCategory = localStorage.getItem("category");
      console.log(showPreferences, favCategory);
      try {
        setLoadingActivity(true);
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
          setActivities(data); // Set initial activities to all fetched activities
          console.log("acs: ", data);
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setActivities(tempActivities);
        }
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
      finally {
        setLoadingActivity(false);
      }
    };
    fetchActivities();
  }, [id]);

  const handleSaveItinerary = async (itineraryId, currentIsSaved) => {
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/itinerary/save/${itineraryId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        message.success("Itinerary saved successfully");
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary._id === itineraryId
              ? {
                ...itinerary,
                saved: { ...itinerary.saved, isSaved: newIsSaved },
              }
              : itinerary
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
      // Loop through itineraries to fetch save states
      const newSaveStates = {};
      await Promise.all(
        itineraries.map(async (itinerary) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/itinerary/getSave/${itinerary._id}/${username}`
            );

            if (response.status === 200) {
              newSaveStates[itinerary._id] = response.data.saved; // Save the state
            }
          } catch (error) {
            console.error(
              `Failed to fetch save state for ${itinerary._id}:`,
              error
            );
          }
        })
      );
      setSaveStates(newSaveStates); // Update state with all fetched save states
    };

    if (itineraries.length > 0) {
      fetchSaveStates();
    }
  }, [itineraries]);

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
      setIsSavedActivity(isSavedActivity);
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const [saveStatesActivity, setSaveStatesActivity] = useState({});

  useEffect(() => {
    const fetchSaveStatesActivity = async () => {

      const newSaveStatesActivity = {};
      await Promise.all(
        activities.map(async (activity) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/activity/getSave/${activity._id}/${username}`
            );
            console.log("hal heya saved: ", response.data);
            console.log("what is the status ", response.status);

            if (response.status === 200) {
              newSaveStatesActivity[activity._id] = response.data.saved; // Save the state
            }
          } catch (error) {
            console.error(
              `Failed to fetch save state for ${activity._id}:`,
              error
            );
          }
        })
      );

      setSaveStatesActivity(newSaveStatesActivity); // Update state with all fetched save states
    };

    if (activities.length > 0) {
      fetchSaveStatesActivity();
    }
  }, [activities]);

  const requestNotification = async (eventId) => {
    try {
      const response = await axios.post('http://localhost:8000/notification/request', {
        user: username,
        eventId: eventId,
      });

      if (response.status === 201) {
        message.success('You will be notified when this event starts accepting bookings.');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error requesting notification:', error);
      message.error('Failed to request notification.');
    }
  };

  if (loadingActivity) {
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
          Loading saved activities...
        </Typography>
      </Box>
    );
  }

  if (loadingItinerary) {
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
          Loading saved itineraries...
        </Typography>
      </Box>
    );
  }

  if ((!Array.isArray(itineraries) && !Array.isArray(activities)) || (itineraries.length === 0 && activities.length === 0)) {
    return <p>No saved data available.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <TouristSidebar />
      <Box
        sx={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "visible",
          height: "100vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Saved Items</Typography>
        </Box>

        <MyChips chipNames={chipNames} onChipClick={handleChipClick} />

        {(selectedCategory === "Itineraries" ||
          selectedCategory === "All") && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Typography variant="h4">Saved Itineraries</Typography>
              </Box>
              <div style={{ flex: 1 }}>
                {itineraries.length > 0 ? (
                  <Box>
                    <TableContainer
                      component={Paper}
                      style={{ borderRadius: 20 }}
                    >
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Activities</TableCell>
                            <TableCell>Locations</TableCell>
                            <TableCell>Timeline</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>
                              Price
                              <CurrencyConvertor
                                onCurrencyChange={handleCurrencyChange}
                              />
                            </TableCell>
                            <TableCell>Available Dates and Times</TableCell>
                            <TableCell>Accessibility</TableCell>
                            <TableCell>Pick Up Location</TableCell>
                            <TableCell>Drop Off Location</TableCell>
                            <TableCell>Ratings</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Bookmark</TableCell>
                            <TableCell>Notify Me</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            itineraries.map((itinerary) =>
                              itinerary.flag === false &&
                                itinerary.isDeactivated === false &&
                                itinerary.tourGuideDeleted === false &&
                                itinerary.deletedItinerary === false &&
                                itinerary.saved.user === username &&
                                itinerary.saved.isSaved === true ? (
                                <TableRow key={itinerary._id}>
                                  <TableCell>
                                    {itinerary.activity &&
                                      itinerary.activity.length > 0
                                      ? itinerary.activity.map(
                                        (activity, index) => (
                                          <div key={index}>
                                            {activity.name || "N/A"} - Price:{" "}
                                            {""}
                                            {activity.price !== undefined
                                              ? activity.price
                                              : "N/A"}
                                            ,<br />
                                            Location:{" "}
                                            {activity.location || "N/A"},
                                            <br />
                                            Category:{" "}
                                            {activity.category || "N/A"}
                                            <br />
                                            <br />
                                          </div>
                                        )
                                      )
                                      : "No activities available"}
                                  </TableCell>
                                  <TableCell>
                                    {itinerary.locations &&
                                      itinerary.locations.length > 0
                                      ? itinerary.locations.map(
                                        (location, index) => (
                                          <div key={index}>
                                            <Typography variant="body1">
                                              Location {index + 1}:{" "}
                                              {location.trim()}
                                            </Typography>
                                            <br />
                                          </div>
                                        )
                                      )
                                      : "No locations available"}
                                  </TableCell>
                                  <TableCell>{itinerary.timeline}</TableCell>
                                  <TableCell>{itinerary.language}</TableCell>
                                  <TableCell>
                                    {(
                                      itinerary.price *
                                      (exchangeRates[currency] || 1)
                                    ).toFixed(2)}{" "}
                                    {currency}
                                  </TableCell>
                                  <TableCell>
                                    {itinerary.availableDatesAndTimes.length > 0
                                      ? itinerary.availableDatesAndTimes.map(
                                        (dateTime, index) => {
                                          const dateObj = new Date(dateTime);
                                          const date = dateObj
                                            .toISOString()
                                            .split("T")[0];
                                          const time = dateObj
                                            .toTimeString()
                                            .split(" ")[0];
                                          return (
                                            <div key={index}>
                                              Date {index + 1}: {date}
                                              <br />
                                              Time {index + 1}: {time}
                                            </div>
                                          );
                                        }
                                      )
                                      : "No available dates and times"}
                                  </TableCell>
                                  <TableCell>{itinerary.accessibility}</TableCell>
                                  <TableCell>
                                    {itinerary.pickUpLocation}
                                  </TableCell>
                                  <TableCell>
                                    {itinerary.dropOffLocation}
                                  </TableCell>
                                  <TableCell>
                                    <Rating
                                      value={itinerary.averageRating}
                                      precision={0.1}
                                      readOnly
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {itinerary.tags && itinerary.tags.length > 0
                                      ? itinerary.tags.map((tag, index) => (
                                        <div key={index}>
                                          {tag || "N/A"}
                                          <br />
                                          <br />
                                        </div>
                                      ))
                                      : "No tags available"}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      onClick={() =>
                                        handleSaveItinerary(
                                          itinerary._id,
                                          itinerary.saved?.isSaved
                                        )
                                      }
                                    >
                                      {saveStates[itinerary._id] ? (
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
                                  <TableCell>
                                    <Tooltip title="Notify me when active">
                                      <IconButton
                                        color="error"
                                        aria-label="notify me"
                                        onClick={() =>
                                          requestNotification(itinerary._id)
                                        }
                                      >
                                        <NotificationAddIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ) : null
                            ) // We don't output a row when it has `itinerary.flag` is true (ie itinerary is inappropriate) or when the itinerary is inactive or its tour guide has left the system  or the itinerary has been deleted but cannot be removed from database since it is booked my previous tourists
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <Typography variant="body1" style={{ marginTop: "20px" }}>
                    No itineraries found.
                  </Typography>
                )}
              </div>
            </>
          )}

        {(selectedCategory === "Activities" ||
          selectedCategory === "All") && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  marginTop: "20px",
                }}
              >
                <Typography variant="h4">Saved Activities</Typography>
              </Box>
              {activities.length > 0 ? (
                <Box>
                  <TableContainer component={Paper} style={{ borderRadius: 20 }}>
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
                          <TableCell>Bookmark</TableCell>
                          <TableCell>Notify Me</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          activities.map((activity) =>
                            activity.flag === false &&
                              activity.advertiserDeleted === false &&
                              activity.deletedActivity === false &&
                              activity.saved.user === username &&
                              activity.saved.isSaved ? (
                              <TableRow key={activity._id}>
                                <TableCell>{activity.name}</TableCell>
                                <TableCell>
                                  {(
                                    activity.price *
                                    (exchangeRates[currency] || 1)
                                  ).toFixed(2)}{" "}
                                  {currency}
                                </TableCell>
                                <TableCell>
                                  {activity.isOpen ? "Yes" : "No"}
                                </TableCell>
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
                                  <span
                                    onClick={() =>
                                      handleSaveActivity(
                                        activity._id,
                                        activity.saved?.isSaved
                                      )
                                    }
                                  >
                                    {saveStatesActivity[activity._id] ? (
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
                                <TableCell>
                                  <Tooltip title="Notify me when active">
                                    <IconButton
                                      color="error"
                                      aria-label="notify me"
                                      onClick={() =>
                                        requestNotification(activity._id)
                                      }
                                    >
                                      <NotificationAddIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ) : null
                          ) // We don't output a row when it has `activity.flag` is true (ie activity is inappropriate) or when the activity's advertiser has left the system or the activity has been deleted but cannot be removed from database since it is booked my previous tourists
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Typography variant="body1" style={{ marginTop: "20px" }}>
                  No activities saved.
                </Typography>
              )}
            </>
          )}
      </Box>
    </>
  );
}

export default MySavedItems;
