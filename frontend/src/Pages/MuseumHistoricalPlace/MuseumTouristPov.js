// This file contains everything the tourist should see : all museums of all tourism governors, search filter, and see upcoming museum visits
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
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MuseumTouristPov = () => {
  const { id } = useParams();

  const [Museums, setMuseums] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const navigate = useNavigate();

  // Fetch all museums on component mount
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

  // Callback to handle search results
  const handleSearchResults = (searchResults) => {
    setMuseums(searchResults); // Update table data with search results
  };

  // Callback to handle filter results
  const handleFilterResults = (filterResults) => {
    setMuseums(filterResults); // Update table data with filter results
  };

  // Navigate to the upcoming museums page
  const goToUpcomingPage = () => {
    navigate("/UpcomingMuseums");
  };

  // Share museum functionality
  const handleShareLink = (MuseumId) => {
    const link = `${window.location.origin}/MuseumTouristPov/${MuseumId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (MuseumId) => {
    const link = `${window.location.origin}/MuseumTouristPov/${MuseumId}`; // Update with your actual route
    const subject = "Check out this museum";
    const body = `Here is the link to the museum: ${link}`;
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
      <Button
        component={Link}
        to={isGuest ? "/guestDashboard" : "/touristDashboard"}
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
      >
        Back to Dashboard
      </Button>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: "visible", height: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Available Museum Visits</Typography>
        </Box>

        {/* Render the search component and pass the callback */}
        <div>
          <MuseumSearch onSearch={handleSearchResults} />
        </div>

        {/* Render the filter component and pass the callback */}
        <div>
          <MuseumFilterComponent onFilter={handleFilterResults} />
        </div>

        {/* Button to navigate to upcoming museums */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToUpcomingPage}
          >
            Get Upcoming Museum Visits
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Pictures</TableCell>
                <TableCell>
                  Ticket Price
                  <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Opening Time</TableCell>
                <TableCell>Closing Time</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(Museums) && Museums.length > 0 ? (
                Museums.map((museum) => (
                  <TableRow key={museum._id}>
                    <TableCell>{museum.description}</TableCell>
                    <TableCell>{museum.location}</TableCell>
                    <TableCell>
                      <img
                        src={museum.pictures}
                        alt="Museum"
                        style={{
                          width: "100px",
                          height: "auto",
                          objectFit: "cover",
                        }} // Adjust as needed
                      />
                    </TableCell>
                    <TableCell>
                      {(
                        museum.ticketPrices * (exchangeRates[currency] || 1)
                      ).toFixed(2)}{" "}
                      {currency}
                    </TableCell>
                    <TableCell>{museum.openingTime}</TableCell>
                    <TableCell>{museum.closingTime}</TableCell>
                    <TableCell>{museum.museumDate}</TableCell>
                    <TableCell>{museum.museumName}</TableCell>
                    <TableCell>{museum.museumCategory}</TableCell>
                    <TableCell>{museum.tags.join(", ")}</TableCell>
                    <TableCell>{museum.createdBy}</TableCell>
                    {id === undefined ? (
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleShareLink(museum._id)}
                        >
                          Share Via Link
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleShareEmail(museum._id)}
                        >
                          Share Via Email
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No museums available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Help />
    </Box>
  );
};

export default MuseumTouristPov;
