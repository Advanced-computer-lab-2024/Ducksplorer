import React, { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import DuckLoading from "../Components/Loading/duckLoading.js";
import Error404 from "../Components/Error404.js";

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
  CircularProgress,
  Grid,
  Tabs,
  Tab
} from "@mui/material";
import MyTabs from "../Components/MyTabs.js";
import TouristNavBar from "../Components/TouristNavBar.js";
import ItineraryCard from "../Components/itineraryCard.js";
import ActivityCard from "../Components/activityCard.js";
import Help from "../Components/HelpIcon.js";

function MySavedItems() {
  const { id } = useParams();

  const tabNames = ["All", "Itineraries", "Activities"];
  const [selectedTab, setSelectedTab] = useState("All");

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

  const errorMessage =
    "The savedItems you are looking for might be removed or is temporarily unavailable";
  const backMessage = "BACK TO TOURIST DASHBOARD";

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
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
        console.log("Itineraries Length: ", itineraries.length);
        console.log("Activities Length: ", activities.length);

      } catch (error) {
        console.error("There was an error fetching the itineraries!", error);
      } finally {
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
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchActivities();
  }, [id]);

  const handleRemoveItinerary = (itineraryId) => {
    setItineraries((prevItineraries) =>
      prevItineraries.filter((itinerary) => itinerary._id !== itineraryId)
    );
  };

  const handleRemoveActivity = (activityId) => {
    setActivities((prevActivities) =>
      prevActivities.filter((activity) => activity._id !== activityId)
    );
  };

  const requestNotification = async (eventId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/notification/request",
        {
          user: username,
          eventId: eventId,
        }
      );

      if (response.status === 201) {
        message.success(
          "You will be notified when this event starts accepting bookings."
        );
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error requesting notification:", error);
      message.error("Failed to request notification.");
    }
  };

  if (loadingActivity || loadingItinerary) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  if (
    (!Array.isArray(itineraries) && !Array.isArray(activities)) ||
    (itineraries.length === 0 && activities.length === 0)
  ) {
    return (
      <>
        <TouristNavBar />
        <Error404
          errorMessage={errorMessage}
          backMessage={backMessage}
          route="/touristDashboard"
        />
      </>
    );
  }

  return (
    <>
      <TouristNavBar />
      
      <div style={{ overflowY: 'visible', height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography
            variant="h4"
            className="bigTitle"
            sx={{  color: "black", fontWeight: 'bold' }}
          >
            Saved
          </Typography>
        </Box>

        <MyTabs tabNames={tabNames} onTabClick={(tabName) => setSelectedTab(tabName)} />

        {(selectedTab === "Itineraries" || selectedTab === "All") && (
          <>
            {/* <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Typography variant="h4">Itineraries</Typography>
              </Box> */}
            <div style={{ flex: 1 }}>
              {itineraries.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px", // Adjust the gap between items as needed
                    paddingBottom: 24,
                    paddingTop: 24
                  }}
                >
                  {
                    itineraries.map((itinerary) =>
                      itinerary.flag === false &&
                        itinerary.isDeactivated === false &&
                        itinerary.tourGuideDeleted === false &&
                        itinerary.deletedItinerary === false &&
                        itinerary.saved.user === username &&
                        itinerary.saved.isSaved === true ? (
                        <ItineraryCard itinerary={itinerary} onRemove={handleRemoveItinerary} showNotify={true} />
                      ) : null
                    ) // We don't output a row when it has `itinerary.flag` is true (ie itinerary is inappropriate) or when the itinerary is inactive or its tour guide has left the system  or the itinerary has been deleted but cannot be removed from database since it is booked my previous tourists
                  }
                </div>
              ) : (
                <Typography variant="body1" style={{ marginTop: "20px" }}>
                  No itineraries found.
                </Typography>
              )}
            </div>
          </>
        )}

        {(selectedTab === "Activities" ||
          selectedTab === "All") && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  marginTop: "20px",
                }}
              >
                {/* <Typography variant="h4"> Activities</Typography> */}
              </Box>
              <Grid container spacing={4}>
                {Array.isArray(activities) && activities.length > 0 ? (
                  activities.map((activity) =>
                    activity.flag === false &&
                      activity.advertiserDeleted === false &&
                      activity.deletedActivity === false &&
                      activity.saved.user === username &&
                      activity.saved.isSaved === true ? (
                      <Grid item xs={12} sm={8} md={6} key={activity._id}>
                        <ActivityCard activity={activity} onRemove={handleRemoveActivity} showNotify={true} />
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
            </>
          )}
        {/* </Box> */}
      </div>
      <Help />
    </>
  );
}

export default MySavedItems;
