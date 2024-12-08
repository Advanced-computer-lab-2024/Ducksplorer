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
import DuckLoading from "../../Components/Loading/duckLoading.js";
import { Box, Button, Typography,Checkbox, Grid, Container,IconButton,Tooltip } from "@mui/material";
import MuseumHistoricalPlaceCard from "../../Components/MuseumHistoricalPlaceCard";
import Input from "@mui/joy/Input";
import Error404 from "../../Components/Error404.js";
import NavigationTabs from "../../Components/NavigationTabs.js";
import HistoricalPlaceTouristPov from "./HistoricalPlaceTouristPov";
import UpdateIcon from "@mui/icons-material/Update";


const MuseumTouristPov = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const { id } = useParams();
  const [Museums, setMuseums] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [searchQuery, setSearchQuery] = useState(""); // Add this line
  const navigate = useNavigate();
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const tabs = ["Museums", "Historical Places"];
  const paths = ["/MuseumTouristPov", "/HistoricalPlaceTouristPov"];
  const [pastOrUpcoming,setPastOrUpcoming] = useState(false);


  useEffect(() => {
    setLoading(true);
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
        console.log("this is how the data should be:", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the museums!", error);
        message.error("Error fetching museums!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };


  const handleUpcoming = () => {
    if(!pastOrUpcoming){
      axios
      .get(`http://localhost:8000/museum/getAllUpcomingMuseums`)
      .then((response) => {
        setMuseums(response.data.upcomingMuseums);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the upcoming museum visits!",
          error
        );
        message.error("Error fetching upcoming museum visits!");
      });
    }else{
      setLoading(true);
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
        console.log("this is how the data should be:", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the museums!", error);
        message.error("Error fetching museums!");
      })
      .finally(() => {
        setLoading(false);
      });
    }
    setPastOrUpcoming(!pastOrUpcoming);
  };

  const handleSearchMuseums = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleFilterResults = (filterResults) => {
    setMuseums(filterResults);
  };

  const goToUpcomingPage = () => {
    navigate("/UpcomingMuseums");
  };

  const errorMessage =
    "There are currently no upcoming museum visits. Try again in a few";
  const backMessage = "Back to search again";

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
      <div style={{ marginLeft: "4%", marginTop: "2%" }}>
        <div>
          <NavigationTabs tabNames={tabs} paths={paths} />
        </div>
      </div>

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
              sx={{ backgroundColor: "#ff9933", color: "white" }}
            >
              Search
            </Button>
            <Tooltip title={pastOrUpcoming ? "All Museums" : "Upcoming Museums"}>
              <IconButton onClick={handleUpcoming}>
                {" "}
                {/* try to make it on the right later */}
                <UpdateIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
            <MuseumFilterComponent onFilter={handleFilterResults} />
          </div>

          <Grid container spacing={3}>
            {Array.isArray(Museums) && Museums.length > 0 ? (
              Museums.map((museum) => (
                <Grid item xs={12} sm={6} md={4} key={museum._id}>
                  <MuseumHistoricalPlaceCard place={museum} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Error404
                  errorMessage={errorMessage}
                  backMessage={backMessage}
                  route="/MuseumTouristPov"
                />
              </Grid>
            )}
          </Grid>
        </Container>
      <Help />
    </Box>
  );
};

export default MuseumTouristPov;
