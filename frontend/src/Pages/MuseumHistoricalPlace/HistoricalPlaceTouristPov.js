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
import DuckLoading from "../../Components/Loading/duckLoading.js";

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
  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const { id } = useParams();
  const [HistoricalPlaces, setHistoricalPlaces] = useState([]);
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false)
  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    const showPreferences = localStorage.getItem("showPreferences");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;
    const role = user?.role;
    setLoading(true);

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
        console.error("There was an error fetching the Historical Places!", error);
        message.error("Error fetching Historical Places!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSearchHistoricalPLaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/historicalPlace/searchHistoricalPlace', {
        params: {
          searchTerm,
        },
      });

      console.log("Backend Response:", response);

      if (response.status === 200) {
        setHistoricalPlaces(response.data.results);
      } else {
        message.error('No historical places found. Try refining your search.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      message.error('An error occurred: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleFilterResults = (filterResults) => {
    setHistoricalPlaces(filterResults);
  };

  const goToUpcomingPage = () => {
    navigate("/UpcomingHistoricalPlaces");
  };

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <Container sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="bigTitle">Historical Places</Typography>
        </Box>
        <div
          style={{
            //div to surround search bar, button and the filter, and 2 sort icons
            display: "grid",
            gridTemplateColumns: "2.5fr 0.5fr auto auto",
            gap: "16px",
            paddingBottom: 24,
            width: "100%",
          }}
        >
          <Input
            placeholder="Search for a museum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="filled"
            color="primary"
          />
          <Button
            variant="solid"
            onClick={handleSearchHistoricalPLaces}
            className="blackhover"
            sx={{ backgroundColor: "#ff9933", color: 'white' }}
          >
            Search
          </Button>
          <HistoricalPlaceFilterComponent onFilter={handleFilterResults} />
        </div>

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
