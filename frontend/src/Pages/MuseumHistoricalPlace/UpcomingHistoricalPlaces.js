import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
} from "@mui/material";
import MuseumHistoricalPlaceCard from "../../Components/MuseumHistoricalPlaceCard";
import HistoricalPlaceSearch from "../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceSearch";
import HistoricalPlaceFilterComponent from "../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceFilterComponent";
import Input from "@mui/joy/Input";

const UpcomingHistoricalPlaces = () => {
  const [upcomingHistoricalPlaces, setUpcomingHistoricalPlaces] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState(""); // Add this line
  const navigate = useNavigate();

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/historicalPlace/getAllUpcomingHistoricalPlaces`
      )
      .then((response) => {
        setUpcomingHistoricalPlaces(response.data.upcomingHistoricalPlaces);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the upcoming historical place visits!",
          error
        );
        message.error("Error fetching upcoming historical place visits!");
      });
  }, []);

  const handleSearchResults = (searchResults) => {
    setUpcomingHistoricalPlaces(searchResults);
  };

  const handleFilterResults = (filterResults) => {
    setUpcomingHistoricalPlaces(filterResults);
  };

  const goToUpcomingPage = () => {
    navigate("/UpcomingHistoricalPlaces");
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4">
            Upcoming Historical Place Visits
          </Typography>
        </Box>


        <Grid container spacing={3}>
          {Array.isArray(upcomingHistoricalPlaces) && upcomingHistoricalPlaces.length > 0 ? (
            upcomingHistoricalPlaces.map((place) => (
              <Grid item xs={12} sm={6} md={4} key={place._id}>
                <MuseumHistoricalPlaceCard place={place} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No Historical Places available
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Help />
        </Box>
      </Container>
    </Box>
  );
};

export default UpcomingHistoricalPlaces;
