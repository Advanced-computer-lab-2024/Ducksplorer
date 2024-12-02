import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
} from "@mui/material";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import MuseumHistoricalPlaceCard from "../../Components/MuseumHistoricalPlaceCard";
import MuseumSearch from "../../Components/MuseumHistoricalPlaceComponent/MuseumSearch";
import MuseumFilterComponent from "../../Components/MuseumHistoricalPlaceComponent/MuseumFilterComponent";
import Input from "@mui/joy/Input";

const UpcomingMuseums = () => {
  const [upcomingMuseums, setUpcomingMuseums] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState(""); // Ensure this line is present
  const navigate = useNavigate();

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/museum/getAllUpcomingMuseums`)
      .then((response) => {
        setUpcomingMuseums(response.data.upcomingMuseums);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the upcoming museum visits!",
          error
        );
        message.error("Error fetching upcoming museum visits!");
      });
  }, []);

  const handleSearchResults = (searchResults) => {
    setUpcomingMuseums(searchResults);
  };

  const handleFilterResults = (filterResults) => {
    setUpcomingMuseums(filterResults);
  };

  const goToUpcomingPage = () => {
    navigate("/UpcomingMuseums");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ffffff",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Upcoming Museum Visits
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(upcomingMuseums) && upcomingMuseums.length > 0 ? (
            upcomingMuseums.map((museum) => (
              <Grid item xs={12} sm={6} md={4} key={museum._id}>
                <MuseumHistoricalPlaceCard place={museum} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No museums available
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

export default UpcomingMuseums;
