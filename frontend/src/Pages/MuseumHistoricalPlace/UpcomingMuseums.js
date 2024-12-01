//This page from inside RUDMuseum
import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Link } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";

const UpcomingMuseums = () => {
  const [upcomingMuseums, setUpcomingMuseums] = useState([]);

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

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

  return (
<Box
  sx={{
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    paddingTop: "64px", // Adjust for navbar height
    overflowY: "auto",
  }}
>
  {/* Navbar */}
  <TouristNavBar />

  {/* Sidebar */}
  <TouristSidebar />

  {/* Main Content */}
  <Box
    sx={{
      maxWidth: 1200,
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: 2,
      boxShadow: 3,
      p: 4,
      mt: 4,
    }}
  >
    {/* Header Section */}
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography variant="h4" fontWeight="700">
        Upcoming Museum Visits
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Explore the list of upcoming museum visits and plan your trip!
      </Typography>
    </Box>

    {/* Table Container */}
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
            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Pictures</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              Ticket Price
              <CurrencyConvertor
                exchangeRates={exchangeRates}
                currency={currency}
                onCurrencyChange={handleCurrencyChange}
              />
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Opening Time</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Closing Time</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Created By</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {upcomingMuseums.map((museum) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Help Section */}
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Help />
    </Box>
  </Box>
</Box>
  );
}
export default UpcomingMuseums;
