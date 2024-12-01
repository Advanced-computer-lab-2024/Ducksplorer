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
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        paddingTop: "64px", // Adjust for navbar height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
  
    
  
      <Box
        sx={{
          p: { xs: 2, sm: 6 },
          maxWidth: 1200,
          width: "100%",
          height:"100vh",
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          overflowY: "visible",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Available Museum Visits
          </Typography>
        
  
        {/* Render the search component */}
        <Box sx={{ mb: 3 }}>
          <MuseumSearch onSearch={handleSearchResults} />
        
  
        {/* Render the filter component */}
        <Box sx={{ mb: 3 }}>
          <MuseumFilterComponent onFilter={handleFilterResults} />
        </Box>
  
        {/* Button to navigate to upcoming museums */}
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
  
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                {[
                  "Description",
                  "Location",
                  "Pictures",
                  "Ticket Price",
                  "Opening Time",
                  "Closing Time",
                  "Date",
                  "Name",
                  "Category",
                  "Tags",
                  "Created By",
                ].map((heading) => (
                  <TableCell key={heading} sx={{ fontWeight: 700 }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
  
            <TableBody>
              {Array.isArray(Museums) && Museums.length > 0 ? (
                Museums.map((museum) => (
                  <TableRow
                    key={museum._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                  >
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
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
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
                    {id === undefined && (
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{ mr: 1 }}
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
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="textSecondary">
                      No museums available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
         </Table>
         
        </TableContainer>
        </Box>
      </Box>
      </Box>
      <Help />
    </Box>
  );
}  

export default MuseumTouristPov;
