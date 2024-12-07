import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import MuseumSearch from "../../Components/MuseumHistoricalPlaceComponent/MuseumSearch";
import MuseumFilterComponent from "../../Components/MuseumHistoricalPlaceComponent/MuseumFilterComponent";
import { Link, useParams } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon.js";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import MuseumHistoricalPlaceCard from "../../Components/MuseumHistoricalPlaceCard";
import Input from "@mui/joy/Input";

const MuseumTouristPov = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const { id } = useParams();
  const [Museums, setMuseums] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState(""); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/museum/getAllMuseums`)
      .then((response) => {
        if (id === undefined) {
          setMuseums(response.data);
        } else {
          const tempMuseums = response.data.filter(
            (museum) => museum._id === id
          );
          setMuseums(tempMuseums);
        }
        console.log("this is how the data should be:",response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the museums!", error);
        message.error("Error fetching museums!");
      });
  }, [id]);

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  const handleSearchMuseums = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/museum/searchMuseum",
        {
          params: {
            searchTerm,
          },
        }
      );

      if (response.status === 200) {
        setMuseums(response.data.results);
      } else {
        message.error("Failed to search museums");
      }
    } catch (error) {
      message.error(" No museums found ");
    }
  };

  const handleFilterResults = (filterResults) => {
    setMuseums(filterResults);
  };

  const goToUpcomingPage = () => {
    navigate("/UpcomingMuseums");
  };

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
        <Typography class="bigTitle">Museums</Typography>
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
            onClick={handleSearchMuseums}
            className="blackhover"
            sx={{ backgroundColor: "#ff9933" , color: 'white'}}
          >
            Search
          </Button>
          <MuseumFilterComponent onFilter={handleFilterResults} />
        </div>
        

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              paddingX: 4,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
            onClick={goToUpcomingPage}
          >
            Get Upcoming Museum Visits
          </Button>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(Museums) && Museums.length > 0 ? (
            Museums.map((museum) => (
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
      </Container>
      <Help />
    </Box>
  );
};

export default MuseumTouristPov;
