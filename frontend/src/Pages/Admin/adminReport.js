import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateProductRating } from "../../Utilities/averageRating";
import { calculateAverageRating } from "../../Utilities/averageRating";
import MyChips from "../../Components/MyChips";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { message } from 'antd';


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
  Menu,
  MenuItem,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  Rating,
} from "@mui/material";

const AdminReport = () => {
  const chipNames = [
    "Activities Report",
    "Itineraries Report",
    "Products Report",
  ];
  const [selectedCategory, setSelectedCategory] = useState("Activities Report");
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [products, setProducts] = useState([]);

  const [priceExchangeRates, setPriceExchangeRates] = useState({});
  const [priceCurrency, setPriceCurrency] = useState("EGP");

  const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
  const [earningsCurrency, setEarningsCurrency] = useState("EGP");

  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  //filtering consts
  const [activityMonth, activitySetMonth] = useState("");
  const [activityYear, activitySetYear] = useState("");
  const [activityDate, activitySetDate] = useState(null);
  const [activityFilterAnchorEl, activitySetFilterAnchorEl] = useState(null);

  const [itineraryMonth, itinerarySetMonth] = useState("");
  const [itineraryYear, itinerarySetYear] = useState("");
  const [itineraryDate, itinerarySetDate] = useState(null);
  const [itineraryFilterAnchorEl, itinerarySetFilterAnchorEl] = useState(null);

  const [productMonth, productSetMonth] = useState("");
  const [productYear, productSetYear] = useState("");
  const [productDate, productSetDate] = useState(null);
  const [productFilterAnchorEl, productSetFilterAnchorEl] = useState(null);

  const [activitySelectedFilters, activitySetSelectedFilters] = useState([]);
  const [itinerarySelectedFilters, itinerarySetSelectedFilters] = useState([]);
  const [productSelectedFilters, productSetSelectedFilters] = useState([]);

  const [activityFilterType, activitySetFilterType] = useState("");
  const [activityFiltersApplied, activitySetFiltersApplied] = useState(false);

  const [itineraryFilterType, itinerarySetFilterType] = useState("");
  const [itineraryFiltersApplied, itinerarySetFiltersApplied] = useState(false);

  const [productFilterType, productSetFilterType] = useState("");
  const [productFiltersApplied, productSetFiltersApplied] = useState(false);

  const [activityLoading, activitySetLoading] = useState(false); // State for loading status
  const [itineraryLoading, itinerarySetLoading] = useState(false); // State for loading status
  const [productLoading, productSetLoading] = useState(false); // State for loading status

  const [errorActivityMessage, activitySetErrorMessage] = useState("");  // State for error message
  const [itineraryErrorMessage, itinerarySetErrorMessage] = useState("");  // State for error message
  const [productErrorMessage, productSetErrorMessage] = useState("");  // State for error message

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportActivities")
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportItineraries")
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the itineraries!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportProducts")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  //Filtering handlers
  const activityHandleFilterChoiceClick = (event) => {
    activitySetFilterAnchorEl(event.currentTarget);
  };
  const activityHandleFilterClose = () => {
    activitySetFilterAnchorEl(null);
  };
  const itineraryHandleFilterChoiceClick = (event) => {
    itinerarySetFilterAnchorEl(event.currentTarget);
  };
  const itineraryHandleFilterClose = () => {
    itinerarySetFilterAnchorEl(null);
  };
  const productHandleFilterChoiceClick = (event) => {
    productSetFilterAnchorEl(event.currentTarget);
  };
  const productHandleFilterClose = () => {
    productSetFilterAnchorEl(null);
  };

  //clear all filters
  const activityHandleClearFilters = async () => {
    activitySetDate("");
    activitySetMonth("");
    activitySetYear("");
    activitySetSelectedFilters([]);
    activitySetFiltersApplied(false);

    try {
      const response = await axios.get(
        `http://localhost:8000/admin/reportActivities`
      );

      setActivities(response.data);
    } catch (error) {
      console.error("Error resetting activities:", error);
    }
    activityHandleFilterClose();
  };

  //clear all filters
  const itineraryHandleClearFilters = async () => {
    itinerarySetDate("");
    itinerarySetMonth("");
    itinerarySetYear("");
    itinerarySetSelectedFilters([]);
    itinerarySetFiltersApplied(false);

    try {
      const response = await axios.get(
        `http://localhost:8000/admin/reportItineraries`
      );

      setItineraries(response.data);
    } catch (error) {
      console.error("Error resetting itineraries:", error);
    }
    itineraryHandleFilterClose();
  };

  //clear all filters
  const productHandleClearFilters = async () => {
    productSetDate("");
    productSetMonth("");
    productSetYear("");
    productSetSelectedFilters([]);
    productSetFiltersApplied(false);

    try {
      const response = await axios.get(
        `http://localhost:8000/admin/reportProducts`
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error resetting products:", error);
    }
    productHandleFilterClose();
  };

  const fetchFilteredActivities = async () => {
    activitySetLoading(true);
    activitySetErrorMessage(""); // Reset error message before fetching

    try {
      let queryString = "";

      // Apply date filter if selected
      if (activityDate) {
        queryString += `date=${activityDate}&`;
      }

      // Apply month and year filters only if selected
      else if (activityMonth) {
        queryString += `month=${activityMonth}&`;
      }

      if (activityYear) {
        queryString += `year=${activityYear}&`;
      }

      // Remove the trailing '&' if it exists
      queryString = queryString.endsWith("&")
        ? queryString.slice(0, -1)
        : queryString;

      // Fetch activities with the constructed query string
      const response = await axios.get(
        `http://localhost:8000/admin/filterReportActivities?${queryString}`
      );
      setActivities(response.data);

      if (response.data.length === 0) {
        activitySetErrorMessage("No activities found for the selected filters.");
      }
    } catch (error) {
      activitySetErrorMessage("Error fetching activities!");
    } finally {
      activitySetLoading(false);
    }
  };

  const fetchFilteredItineraries = async () => {
    itinerarySetLoading(true);
    itinerarySetErrorMessage(""); // Reset error message before fetching

    try {
      let queryString = "";

      // Apply date filter if selected
      if (itineraryDate) {
        queryString += `date=${itineraryDate}&`;
      }

      // Apply month and year filters only if selected
      else if (itineraryMonth) {
        queryString += `month=${itineraryMonth}&`;
      }

      if (itineraryYear) {
        queryString += `year=${itineraryYear}&`;
      }

      // Remove the trailing '&' if it exists
      queryString = queryString.endsWith("&")
        ? queryString.slice(0, -1)
        : queryString;

      // Fetch itineraries with the constructed query string
      const response = await axios.get(
        `http://localhost:8000/admin/filterReportItineraries?${queryString}`
      );
      setItineraries(response.data);

      if (response.data.length === 0) {
        itinerarySetErrorMessage("No itineraries found for the selected filters.");
      }
    } catch (error) {
      itinerarySetErrorMessage("Error fetching itineraries!");
    } finally {
      itinerarySetLoading(false);
    }
  };

  const fetchFilteredProducts = async () => {
    productSetLoading(true);
    productSetErrorMessage(""); // Reset error message before fetching

    try {
      let queryString = "";

      // Apply date filter if selected
      if (productDate) {
        queryString += `date=${productDate}&`;
      }

      // Apply month and year filters only if selected
      else if (productMonth) {
        queryString += `month=${productMonth}&`;
      }

      if (productYear) {
        queryString += `year=${productYear}&`;
      }

      // Remove the trailing '&' if it exists
      queryString = queryString.endsWith("&")
        ? queryString.slice(0, -1)
        : queryString;

      // Fetch products with the constructed query string
      const response = await axios.get(
        `http://localhost:8000/admin/filterReportProducts?${queryString}`
      );
      setProducts(response.data);

      if (response.data.length === 0) {
        productSetErrorMessage("No products found for the selected filters.");
      }
    } catch (error) {
      productSetErrorMessage("Error fetching products!");
    } finally {
      productSetLoading(false);
    }
  };

  useEffect(() => {
    if (activityFiltersApplied) return;
    if (!activityDate && !activityMonth && !activityYear) return;
    if (selectedCategory == "Activities Report")
      fetchFilteredActivities();
  }, [activityFiltersApplied, activityDate, activityMonth, activityYear]);

  useEffect(() => {
    if (!itineraryFiltersApplied) return;
    if (!itineraryDate && !itineraryMonth && !itineraryYear) return;
    if (selectedCategory == "Itineraries Report")
      fetchFilteredItineraries();
  }, [itineraryFiltersApplied, itineraryDate, itineraryMonth, itineraryYear]);

  useEffect(() => {
    if (!productFiltersApplied) return;
    if (!productDate && !productMonth && !productYear) return;
    if (selectedCategory == "Products Report")
      fetchFilteredProducts();
  }, [productFiltersApplied, productDate, productMonth, productYear]);


  const generateYearOptions = () => {
    const startYear = 2030;
    const numOptions = 50; // Limit to 50 options
    return Array.from({ length: numOptions }, (_, i) => startYear - i).filter(
      (year) => year >= 0
    );
  };

  const changeActivityDate = (newDate) => {
    activitySetDate(newDate);
    activitySetMonth("");
    activitySetYear("");
    activitySetFiltersApplied(true);
  };

  const changeActivityMonth = (newMonth) => {
    activitySetMonth(newMonth);
    activitySetDate(""); // Reset date if month is selected
    activitySetFiltersApplied(true);
  };

  const changeActivityYear = (newYear) => {
    activitySetYear(newYear);
    activitySetDate(""); // Reset date if month is selected
    activitySetFiltersApplied(true);
  };

  const changeItineraryDate = (newDate) => {
    itinerarySetDate(newDate);
    itinerarySetMonth("");
    itinerarySetYear("");
    itinerarySetFiltersApplied(true);
  };

  const changeItineraryMonth = (newMonth) => {
    itinerarySetMonth(newMonth);
    itinerarySetDate(""); // Reset date if month is selected
    itinerarySetFiltersApplied(true);
  };

  const changeItineraryYear = (newYear) => {
    itinerarySetYear(newYear);
    itinerarySetDate(""); // Reset date if month is selected
    itinerarySetFiltersApplied(true);
  };

  const changeProductDate = (newDate) => {
    productSetDate(newDate);
    productSetMonth("");
    productSetYear("");
    productSetFiltersApplied(true);
  };

  const changeProductMonth = (newMonth) => {
    productSetMonth(newMonth);
    productSetDate(""); // Reset date if month is selected
    productSetFiltersApplied(true);
  };

  const changeProductYear = (newYear) => {
    productSetYear(newYear);
    productSetDate(""); // Reset date if month is selected
    productSetFiltersApplied(true);
  };

  const handlePriceCurrencyChange = (rates, selectedCurrency) => {
    setPriceExchangeRates(rates);
    setPriceCurrency(selectedCurrency);
  };

  const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
    setEarningsExchangeRates(rates);
    setEarningsCurrency(selectedCurrency);
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  const getReviewerRating = (reviewer) => {
    const ratingEntry = products.ratings.find(
      (rating) => rating.buyer === reviewer
    );
    return ratingEntry ? ratingEntry.rating : "No rating available";
  };

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);
    console.log(selectedCategory);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "visible",
        height: "100vh",
      }}
    >
      <MyChips chipNames={chipNames} onChipClick={handleChipClick} />

      <Link to="/AdminDashboard">Back</Link>

      {selectedCategory === "Activities Report" && (
        <div>
          <Box sx={{ p: 6, width: "2000", overflowY: "visible", height: "100vh", marginLeft: "350px", }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Typography variant="h4">Activities Report</Typography>
            </Box>
            {/* Filtering */}
            <IconButton onClick={activityHandleFilterChoiceClick}>
              <FilterAltIcon />
            </IconButton>
            <Menu
              anchorEl={activityFilterAnchorEl}
              open={Boolean(activityFilterAnchorEl)}
              onClose={activityHandleFilterClose}
            >
              {/* Radio Buttons for Filter Selection */}
              <MenuItem>
                <FormControl>
                  <RadioGroup
                    value={activityFilterType} // This should be managed in state
                    onChange={(e) => {
                      activitySetFilterType(e.target.value); // Update the selected filter type
                      activitySetDate(""); // Clear previous values
                      activitySetMonth("");
                      activitySetYear("");
                    }}
                  >
                    {/* Date Filter */}
                    <FormControlLabel
                      value="date"
                      control={<Radio />}
                      label="Choose a Date"
                    />
                    {activityFilterType === "date" && (
                      <TextField
                        type="date"
                        value={activityDate}
                        onChange={(e) => changeActivityDate(e.target.value)}
                        style={{ marginTop: "10px", width: "100%" }}
                      />
                    )}

                    {/* Month and/or Year Filter */}
                    <FormControlLabel
                      value="monthYear"
                      control={<Radio />}
                      label="Choose Month/Year"
                    />
                    {activityFilterType === "monthYear" && (
                      <div>
                        {/* Month Dropdown */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                          <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select
                              value={activityMonth}
                              onChange={(e) => {
                                changeActivityMonth(e.target.value)
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
                              value={activityYear}
                              onChange={(e) => {
                                changeActivityYear(e.target.value)
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
                <Button onClick={activityHandleClearFilters}>Clear All Filters</Button>
              </MenuItem>
            </Menu>
            <TableContainer style={{ borderRadius: 24 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      Price
                      <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                    </TableCell>
                    <TableCell>Is open</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Dates and Times</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Number of Bookings</TableCell>
                    <TableCell>
                      Earnings
                      <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.length > 0 ? (
                    activities.map((entry) =>
                      entry && entry.activity.deletedActivity === false && entry.activity.totalGain !== undefined ? (
                        <TableRow key={entry.activity._id}>
                          <TableCell>{entry.activity.name}</TableCell>
                          <TableCell>
                            {(entry.activity.price * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                          </TableCell>
                          <TableCell>{entry.activity.isOpen ? "Yes" : "No"}</TableCell>
                          <TableCell>{entry.activity.category}</TableCell>
                          <TableCell>{entry.activity.tags.join(", ")}</TableCell>
                          <TableCell>{entry.activity.specialDiscount}</TableCell>
                          <TableCell>
                            {entry.activity.date ? (() => {
                              const dateObj = new Date(entry.activity.date);
                              const date = dateObj.toISOString().split("T")[0];
                              const time = dateObj.toTimeString().split(" ")[0];
                              return (
                                <div>
                                  {date} at {time}
                                </div>
                              );
                            })() : "No available date"}
                          </TableCell>
                          <TableCell>{entry.activity.duration}</TableCell>
                          <TableCell>{entry.activity.location}</TableCell>
                          <TableCell>
                            <Rating value={calculateAverageRating(entry.activity.ratings)} precision={0.1} readOnly />
                          </TableCell>
                          <TableCell>
                            {entry.activity.flag ? (
                              <span style={{ color: "red", display: "flex", alignItems: "center" }}>
                                <WarningIcon style={{ marginRight: "4px" }} />
                                Inappropriate
                              </span>
                            ) : (
                              <span style={{ color: "green", display: "flex", alignItems: "center" }}>
                                <CheckCircleIcon style={{ marginRight: "4px" }} />
                                Appropriate
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{entry.numOfBookings}</TableCell>
                          <TableCell>
                            {((entry.totalEarnings * 0.1) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
                          </TableCell>
                        </TableRow>
                      ) : null
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12}>No activities found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </Box>
        </div>
      )}

      {selectedCategory === "Itineraries Report" && (
        <div>
          <Box sx={{ p: 6, maxWidth: "120vh", overflowY: "visible", height: "100vh", marginLeft: "350px", }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Typography variant="h4"> Itineraries Report</Typography>
            </Box>
            {/* Filtering */}
            <IconButton onClick={itineraryHandleFilterChoiceClick}>
              <FilterAltIcon />
            </IconButton>
            <Menu
              anchorEl={itineraryFilterAnchorEl}
              open={Boolean(itineraryFilterAnchorEl)}
              onClose={itineraryHandleFilterClose}
            >
              {/* Radio Buttons for Filter Selection */}
              <MenuItem>
                <FormControl>
                  <RadioGroup
                    value={itineraryFilterType} // This should be managed in state
                    onChange={(e) => {
                      itinerarySetFilterType(e.target.value); // Update the selected filter type
                      itinerarySetDate(""); // Clear previous values
                      itinerarySetMonth("");
                      itinerarySetYear("");
                    }}
                  >
                    {/* Date Filter */}
                    <FormControlLabel
                      value="date"
                      control={<Radio />}
                      label="Choose a Date"
                    />
                    {itineraryFilterType === "date" && (
                      <TextField
                        type="date"
                        value={itineraryDate}
                        onChange={(e) => changeItineraryDate(e.target.value)}
                        style={{ marginTop: "10px", width: "100%" }}
                      />
                    )}

                    {/* Month and/or Year Filter */}
                    <FormControlLabel
                      value="monthYear"
                      control={<Radio />}
                      label="Choose Month/Year"
                    />
                    {itineraryFilterType === "monthYear" && (
                      <div>
                        {/* Month Dropdown */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                          <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select
                              value={itineraryMonth}
                              onChange={(e) => {
                                changeItineraryMonth(e.target.value)
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
                              value={itineraryYear}
                              onChange={(e) => {
                                changeItineraryYear(e.target.value)
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
                <Button onClick={itineraryHandleClearFilters}>Clear All Filters</Button>
              </MenuItem>
            </Menu>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Activities
                      <CurrencyConvertor onCurrencyChange={handleActivityCurrencyChange} />
                    </TableCell>
                    <TableCell>Locations</TableCell>
                    <TableCell>Timeline</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>Price
                      <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                    </TableCell>
                    <TableCell>Available Dates And Times</TableCell>
                    <TableCell>Accessibility</TableCell>
                    <TableCell>Pick Up Location</TableCell>
                    <TableCell>Drop Off Location</TableCell>
                    <TableCell>Ratings</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Active Status</TableCell>
                    <TableCell>Number of Bookings</TableCell>
                    <TableCell>Earnings
                      <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itineraries.length > 0 ? (
                    itineraries.map((entry) => entry && entry.itinerary.deletedItinerary === false && entry.itinerary.totalGain !== undefined ? (
                      <TableRow key={entry.itinerary._id}>
                        <TableCell>
                          {entry.itinerary.activity && entry.itinerary.activity.length > 0
                            ? entry.itinerary.activity.map((activity, index) => (
                              <div key={index}>
                                {activity.name || 'N/A'} -
                                Price: {(activity.price * (activityExchangeRates[activityCurrency] || 1)).toFixed(2)} {activityCurrency},<br />
                                Location: {activity.location || 'N/A'},<br />
                                Category: {activity.category || 'N/A'}
                                <br /><br /> {/* Adds an extra line break between activities */}
                              </div>
                            ))
                            : 'No activities available'}
                        </TableCell>

                        <TableCell>
                          {entry.itinerary.locations && entry.itinerary.locations.length > 0 ? (
                            entry.itinerary.locations.map((location, index) => (
                              <div key={index}>
                                <Typography variant="body1">
                                  {index + 1}: {location.trim()}
                                </Typography>
                                <br />
                              </div>
                            ))
                          ) : 'No locations available'}
                        </TableCell>

                        <TableCell>{entry.itinerary.timeline}</TableCell>
                        <TableCell>{entry.itinerary.language}</TableCell>
                        <TableCell>
                          {(entry.itinerary.price * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                        </TableCell>
                        <TableCell>
                          {entry.itinerary.availableDatesAndTimes.length > 0
                            ? entry.itinerary.availableDatesAndTimes.map((dateTime, index) => {
                              const dateObj = new Date(dateTime);
                              const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
                              const time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
                              return (
                                <div key={index}>
                                  Date {index + 1}: {date}<br />
                                  Time {index + 1}: {time}
                                </div>
                              );
                            })
                            : 'No available dates and times'}
                        </TableCell>

                        <TableCell>{entry.itinerary.accessibility}</TableCell>
                        <TableCell>{entry.itinerary.pickUpLocation}</TableCell>
                        <TableCell>{entry.itinerary.dropOffLocation}</TableCell>
                        <TableCell><Rating
                          value={entry.itinerary.averageRating}
                          precision={0.1}
                          readOnly
                        /></TableCell>

                        <TableCell>
                          {entry.itinerary.tags && entry.itinerary.tags.length > 0
                            ? entry.itinerary.tags.map((tag, index) => (
                              <div key={index}>
                                {tag || 'N/A'}
                                <br /><br />
                              </div>
                            ))
                            : 'No tags available'}
                        </TableCell>

                        <TableCell>
                          {entry.itinerary.flag ? (
                            <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                              <WarningIcon style={{ marginRight: '4px' }} />
                              Inappropriate
                            </span>
                          ) : (
                            <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                              <CheckCircleIcon style={{ marginRight: '4px' }} />
                              Appropriate
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {entry.itinerary.isDeactivated ? 'Deactivated' : 'Activated'}
                        </TableCell>
                        <TableCell>{entry.numOfBookings}</TableCell>
                        <TableCell>
                          {((entry.totalEarnings * 0.1) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
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
          </Box>
        </div>
      )}

      {selectedCategory === "Products Report" && (
        <div>
          <Box sx={{ p: 6, maxWidth: "120vh", overflowY: "visible", height: "100vh", marginLeft: "350px", }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Typography variant="h4">Products Report</Typography>
            </Box>
            {/* Filtering */}
            <IconButton onClick={productHandleFilterChoiceClick}>
              <FilterAltIcon />
            </IconButton>
            <Menu
              anchorEl={productFilterAnchorEl}
              open={Boolean(productFilterAnchorEl)}
              onClose={productHandleFilterClose}
            >
              {/* Radio Buttons for Filter Selection */}
              <MenuItem>
                <FormControl>
                  <RadioGroup
                    value={productFilterType} // This should be managed in state
                    onChange={(e) => {
                      productSetFilterType(e.target.value); // Update the selected filter type
                      productSetDate(""); // Clear previous values
                      productSetMonth("");
                      productSetYear("");
                    }}
                  >
                    {/* Date Filter */}
                    <FormControlLabel
                      value="date"
                      control={<Radio />}
                      label="Choose a Date"
                    />
                    {productFilterType === "date" && (
                      <TextField
                        type="date"
                        value={productDate}
                        onChange={(e) => changeProductDate(e.target.value)}
                        style={{ marginTop: "10px", width: "100%" }}
                      />
                    )}

                    {/* Month and/or Year Filter */}
                    <FormControlLabel
                      value="monthYear"
                      control={<Radio />}
                      label="Choose Month/Year"
                    />
                    {productFilterType === "monthYear" && (
                      <div>
                        {/* Month Dropdown */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                          <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select
                              value={productMonth}
                              onChange={(e) => {
                                changeProductMonth(e.target.value)
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
                              value={productYear}
                              onChange={(e) => {
                                changeProductYear(e.target.value)
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
                <Button onClick={productHandleClearFilters}>Clear All Filters</Button>
              </MenuItem>
            </Menu>
            <TableContainer style={{ borderRadius: 20 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price
                      <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                    </TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Available Quantity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Reviews</TableCell>
                    <TableCell>Earnings
                      <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((entry) =>
                      entry && entry.product.totalGain !== undefined ? (
                        <TableRow key={entry.product._id}>
                          <TableCell>{entry.product.name}</TableCell>
                          <TableCell>
                            {(entry.product.price * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={calculateAverageRating(entry.product.ratings)}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>{entry.product.availableQuantity}</TableCell>
                          <TableCell>{entry.product.description}</TableCell>
                          <TableCell>{Object.entries(entry.product.reviews).length > 0 ? (
                            Object.entries(entry.product.reviews).map(([user, review]) => (
                              <div key={user}>
                                <Typography variant="body2">User: {review.buyer}</Typography>
                                <Typography variant="body2">
                                  Rating: {getReviewerRating(review.buyer)}
                                </Typography>
                                <Typography variant="body2">
                                  Comment: {review.review}
                                </Typography>
                              </div>
                            ))
                          ) : (
                            <Typography variant="body2">No reviews available.</Typography>
                          )}
                          </TableCell>
                          <TableCell>
                            {((entry.totalEarnings * 0.1) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
                          </TableCell>
                        </TableRow>
                      ) : null // Don't render the row for deleted products
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12}>No products found</TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default AdminReport;
