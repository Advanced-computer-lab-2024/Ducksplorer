import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import HistoricalPlaceSearch from "../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceSearch";
import HistoricalPlaceFilterComponent from "../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceFilterComponent";
import { Link, useParams } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import MuseumHistoricalPlaceCard from "../../Components/MuseumHistoricalPlaceCard";
import Input from "@mui/joy/Input";

const HistoricalPlaceTouristPov = () => {
  const { id } = useParams();
  const [HistoricalPlaces, setHistoricalPlaces] = useState([]);
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    const showPreferences = localStorage.getItem("showPreferences");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;
    const role = user?.role;

    axios
      .get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`, {
        params: {
          showPreferences: showPreferences.toString(),
          username,
          role,
        },
      })
      .then((response) => {
        if (id === undefined) {
          setHistoricalPlaces(response.data);
        } else {
          const tempHistoricalPlaces = response.data.filter(
            (historicalPlace) => historicalPlace._id === id
          );
          setHistoricalPlaces(tempHistoricalPlaces);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the Historical Places!",
          error
        );
        message.error("Error fetching Historical Places!");
      });
  }, [id]);

  const handleSearchResults = (searchResults) => {
    setHistoricalPlaces(searchResults);
  };

  const handleFilterResults = (filterResults) => {
    setHistoricalPlaces(filterResults);
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
      <TouristSidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4">
            Available Historical Place Visits
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <HistoricalPlaceSearch onSearch={handleSearchResults} />
          <HistoricalPlaceFilterComponent onFilter={handleFilterResults} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToUpcomingPage}
          >
            Get Upcoming Historical Place Visits
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(HistoricalPlaces) && HistoricalPlaces.length > 0 ? (
            HistoricalPlaces.map((historicalPlace) => (
              <Grid item xs={12} sm={6} md={4} key={historicalPlace._id}>
                <MuseumHistoricalPlaceCard place={historicalPlace} />
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
      </Container>
      <Help />
    </Box>
  );
};

export default HistoricalPlaceTouristPov;
