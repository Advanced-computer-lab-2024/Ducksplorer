////This is the page that gets called for the tour guide to see HIS itineraries ONLY
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar.js";
import { message } from "antd";
import TourGuideSidebar from "../../Components/Sidebars/TourGuideSidebar.js";
import DuckLoading from "../../Components/Loading/duckLoading.js";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Rating,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar.js";

const ItineraryReport = () => {
  // Accept userNameId as a prop
  const userName = JSON.parse(localStorage.getItem("user")).username;
  const [itineraries, setItineraries] = useState([]);
  //filtering consts
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [filterType, setFilterType] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [loading, setLoading] = useState(false); // State for loading status
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  // Handle fetching itineraries by userName ID
  useEffect(() => {
    console.log(userName);
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/tourGuideAccount/report/${userName}`
        );
        setItineraries(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("There was an error fetching the itineraries!", error);
        message.error("error in fetching");
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [userName]); // Depend on userNameId

  //Filtering handlers
  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  //clear all filters
  const handleClearAllFilters = async () => {
    setDate("");
    setMonth("");
    setYear("");
    setSelectedFilters([]);
    setFiltersApplied(false);

    try {
      const response = await axios.get(
        `http://localhost:8000/tourGuideAccount/report/${userName}`
      );
      setItineraries(response.data);
    } catch (error) {
      console.error("Error resetting itineraries:", error);
    }
    handleFilterClose();
  };

  const fetchFilteredItineraries = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message before fetching

    try {
      let queryString = "";

      // Apply date filter if selected
      if (date) {
        queryString += `date=${date}&`;
      }

      // Apply month and year filters only if selected
      else if (month) {
        queryString += `month=${month}&`;
      }

      if (year) {
        queryString += `year=${year}&`;
      }

      // Remove the trailing '&' if it exists
      queryString = queryString.endsWith("&")
        ? queryString.slice(0, -1)
        : queryString;

      // Fetch itineraries with the constructed query string
      const response = await axios.get(
        `http://localhost:8000/tourGuideAccount/filterReport/${userName}?${queryString}`
      );

      setItineraries(response.data);

      if (response.data.length === 0) {
        setErrorMessage("No itineraries found for the selected filters.");
      }
    } catch (error) {
      setErrorMessage("Error fetching itineraries!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filtersApplied) return;
    if (!date && !month && !year) return;
    fetchFilteredItineraries();
  }, [filtersApplied, date, month, year]);

  const generateYearOptions = () => {
    const startYear = 2030;
    const numOptions = 50; // Limit to 50 options
    return Array.from({ length: numOptions }, (_, i) => startYear - i).filter(
      (year) => year >= 0
    );
  };

  const [priceExchangeRates, setPriceExchangeRates] = useState({});
  const [priceCurrency, setPriceCurrency] = useState("EGP");

  const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
  const [earningsCurrency, setEarningsCurrency] = useState("EGP");

  const handlePriceCurrencyChange = (rates, selectedCurrency) => {
    setPriceExchangeRates(rates);
    setPriceCurrency(selectedCurrency);
  };

  const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
    setEarningsExchangeRates(rates);
    setEarningsCurrency(selectedCurrency);
  };

  const changeDate = (newDate) => {
    setDate(newDate);
    setFiltersApplied(true);
  };

  const changeMonth = (newMonth) => {
    setMonth(newMonth);
    setDate(""); // Reset date if month is selected
    setFiltersApplied(true);
  };

  const changeYear = (newYear) => {
    setYear(newYear);
    setDate(""); // Reset date if month is selected
    setFiltersApplied(true);
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  if (!Array.isArray(itineraries) || itineraries.length === 0) {
    return <p>No itineraries available.</p>;
  }

    return (
        <Box
            sx={{
                height: "100vh",
                paddingTop: "64px",
                width: "90vw",
                marginLeft: "5vw",
            }}
        >
            <TourGuideNavBar />
            <div
                style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
            >
                <div style={{ overflowY: "visible", height: "100vh" }}>
                    <Typography
                        variant="h2"
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                        gutterBottom
                    >
                        Itineraries Report
                    </Typography>
                    <br></br>
                    {/* Filtering */}
                    <IconButton onClick={handleFilterChoiceClick}>
                        <FilterAltIcon style={{ color: "black" }} />
                    </IconButton>
                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterClose}
                    >
                        {/* Radio Buttons for Filter Selection */}
                        <MenuItem>
                            <FormControl>
                                <RadioGroup
                                    value={filterType} // This should be managed in state
                                    onChange={(e) => {
                                        setFilterType(e.target.value); // Update the selected filter type
                                        setDate(""); // Clear previous values
                                        setMonth("");
                                        setYear("");
                                    }}
                                >
                                    {/* Date Filter */}
                                    <FormControlLabel
                                        value="date"
                                        control={<Radio />}
                                        label="Choose a Date"
                                    />
                                    {filterType === "date" && (
                                        <TextField
                                            type="date"
                                            value={date}
                                            onChange={(e) => changeDate(e.target.value)}
                                            style={{ marginTop: "10px", width: "100%" }}
                                        />
                                    )}

                  {/* Month and/or Year Filter */}
                  <FormControlLabel
                    value="monthYear"
                    control={<Radio />}
                    label="Choose Month/Year"
                  />
                  {filterType === "monthYear" && (
                    <div>
                      {/* Month Dropdown */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        <FormControl fullWidth>
                          <InputLabel>Month</InputLabel>
                          <Select
                            value={month}
                            onChange={(e) => {
                              changeMonth(e.target.value);
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* Year Dropdown */}
                        <FormControl fullWidth>
                          <InputLabel>Year</InputLabel>
                          <Select
                            value={year}
                            onChange={(e) => {
                              changeYear(e.target.value);
                            }}
                          >
                            {generateYearOptions().map((yr) => (
                              <MenuItem key={yr} value={yr}>
                                {yr}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </FormControl>
            </MenuItem>

            {/* Clear Buttons */}
            <MenuItem>
              <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
            </MenuItem>
          </Menu>
          <TableContainer
            component={Paper}
            sx={{
              marginBottom: 4,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              borderRadius: "1.5cap",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Activities
                    <CurrencyConvertor
                      onCurrencyChange={handleActivityCurrencyChange}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Locations
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Timeline
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Language
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Price
                    <CurrencyConvertor
                      onCurrencyChange={handlePriceCurrencyChange}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Available Dates And Times
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Accessibility
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Pick Up Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Drop Off Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Ratings
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Tags
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Flag
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Active Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Number of Bookings
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Earnings
                    <CurrencyConvertor
                      onCurrencyChange={handleEarningsCurrencyChange}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itineraries.length > 0 ? (
                  itineraries.map(
                    (entry) =>
                      entry &&
                      entry.itinerary.deletedItinerary === false &&
                      entry.itinerary.totalGain !== undefined ? (
                        <TableRow key={entry.itinerary._id}>
                          <TableCell>
                            {entry.itinerary.activity &&
                            entry.itinerary.activity.length > 0
                              ? entry.itinerary.activity.map(
                                  (activity, index) => (
                                    <div key={index}>
                                      {activity.name || "N/A"} - Price:{" "}
                                      {(
                                        activity.price *
                                        (activityExchangeRates[
                                          activityCurrency
                                        ] || 1)
                                      ).toFixed(2)}{" "}
                                      {activityCurrency},<br />
                                      Location: {activity.location || "N/A"},
                                      <br />
                                      Category: {activity.category || "N/A"}
                                      <br />
                                      <br />{" "}
                                      {/* Adds an extra line break between activities */}
                                    </div>
                                  )
                                )
                              : "No activities available"}
                          </TableCell>

                          <TableCell>
                            {entry.itinerary.locations &&
                            entry.itinerary.locations.length > 0
                              ? entry.itinerary.locations.map(
                                  (location, index) => (
                                    <div key={index}>
                                      <Typography variant="body1">
                                        {index + 1}: {location.trim()}
                                      </Typography>
                                      <br />
                                    </div>
                                  )
                                )
                              : "No locations available"}
                          </TableCell>

                          <TableCell>{entry.itinerary.timeline}</TableCell>
                          <TableCell>{entry.itinerary.language}</TableCell>
                          <TableCell>
                            {(
                              entry.itinerary.price *
                              (priceExchangeRates[priceCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {priceCurrency}
                          </TableCell>
                          <TableCell>
                            {entry.itinerary.availableDatesAndTimes.length > 0
                              ? entry.itinerary.availableDatesAndTimes.map(
                                  (dateTime, index) => {
                                    const dateObj = new Date(dateTime);
                                    const date = dateObj
                                      .toISOString()
                                      .split("T")[0]; // YYYY-MM-DD format
                                    const time = dateObj
                                      .toTimeString()
                                      .split(" ")[0]; // HH:MM:SS format
                                    return (
                                      <div key={index}>
                                        Date {index + 1}: {date}
                                        <br />
                                        Time {index + 1}: {time}
                                      </div>
                                    );
                                  }
                                )
                              : "No available dates and times"}
                          </TableCell>

                          <TableCell>{entry.itinerary.accessibility}</TableCell>
                          <TableCell>
                            {entry.itinerary.pickUpLocation}
                          </TableCell>
                          <TableCell>
                            {entry.itinerary.dropOffLocation}
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={entry.itinerary.averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>

                          <TableCell>
                            {entry.itinerary.tags &&
                            entry.itinerary.tags.length > 0
                              ? entry.itinerary.tags.map((tag, index) => (
                                  <div key={index}>
                                    {tag || "N/A"}
                                    <br />
                                    <br />
                                  </div>
                                ))
                              : "No tags available"}
                          </TableCell>

                          <TableCell>
                            {entry.itinerary.flag ? (
                              <span
                                style={{
                                  color: "red",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <WarningIcon style={{ marginRight: "4px" }} />
                                Inappropriate
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "green",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <CheckCircleIcon
                                  style={{ marginRight: "4px" }}
                                />
                                Appropriate
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            {entry.itinerary.isDeactivated
                              ? "Deactivated"
                              : "Activated"}
                          </TableCell>
                          <TableCell>{entry.numOfBookings}</TableCell>
                          <TableCell>
                            {(
                              entry.totalEarnings *
                              0.9 *
                              (earningsExchangeRates[earningsCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {earningsCurrency}
                          </TableCell>
                        </TableRow>
                      ) : null //We don't output a row when the itinerary has been deleted but cannot be removed from the database since it is booked by previous tourists
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={12}>No itineraries found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Box>
  );
};

export default ItineraryReport;
