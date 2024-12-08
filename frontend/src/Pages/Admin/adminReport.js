import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import { Link, useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateProductRating } from "../../Utilities/averageRating";
import { calculateAverageRating } from "../../Utilities/averageRating";
import MyTabs from "../../Components/MyTabs.js";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { message } from 'antd';
import DuckLoading from "../../Components/Loading/duckLoading";
import Error404 from "../../Components/Error404";
import NavigationTabs from "../../Components/NavigationTabs.js";

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
  CircularProgress
} from "@mui/material";
import AdminNavbar from "../../Components/NavBars/AdminNavBar";

const AdminReport = () => {

  const tabs = ["Users Report", "Revenue Report"];
  const paths = ["/userReport", "/adminReport"];
  const tabNames = ["Activities Report", "Itineraries Report", "Products Report"];
  const [selectedTab, setSelectedTab] = useState(tabNames[0]);

  const errorMessage1 =
    "The flights you are looking for might be removed or is temporarily unavailable";
  const errorMessage2 =
    "The activities you are looking for might be removed or is temporarily unavailable";
  const errorMessage3 =
    "The itineraries you are looking for might be removed or is temporarily unavailable";
  const backMessage = "BACK TO ADMIN DASHBOARD";


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

  const [errorActivityMessage, activitySetErrorMessage] = useState("");  // State for error message
  const [itineraryErrorMessage, itinerarySetErrorMessage] = useState("");  // State for error message
  const [productErrorMessage, productSetErrorMessage] = useState("");  // State for error message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    activitySetErrorMessage(""); // Reset error message before fetching
    
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchFilteredItineraries = async () => {
    itinerarySetErrorMessage(""); // Reset error message before fetching

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async () => {
    productSetErrorMessage(""); // Reset error message before fetching

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activityFiltersApplied) return;
    if (!activityDate && !activityMonth && !activityYear) return;
    if (selectedTab == "Activities Report")
      fetchFilteredActivities();
  }, [activityFiltersApplied, activityDate, activityMonth, activityYear]);

  useEffect(() => {
    if (!itineraryFiltersApplied) return;
    if (!itineraryDate && !itineraryMonth && !itineraryYear) return;
    if (selectedTab == "Itineraries Report")
      fetchFilteredItineraries();
  }, [itineraryFiltersApplied, itineraryDate, itineraryMonth, itineraryYear]);

  useEffect(() => {
    if (!productFiltersApplied) return;
    if (!productDate && !productMonth && !productYear) return;
    if (selectedTab == "Products Report")
      fetchFilteredProducts();
  }, [productFiltersApplied, productDate, productMonth, productYear]);


  const generateYearOptions = () => {
    const startYear = 2030;
    const numOptions = 50; // Limit to 50 options
    return Array.from({ length: numOptions }, (_, i) => startYear - i).filter(
      (year) => year >= 0
    );
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

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

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  else if (products.length === 0 && selectedTab === "Products Report") {
    return (
      <>
        <AdminNavbar />
        {/* <Error404
          errorMessage={errorMessage1}
          backMessage={backMessage}
          route="/adminDashboard"
        /> */}
        <DuckLoading/>
      </>
    );
  }

  else if (activities.length === 0 && selectedTab === "Activities Report") {
    return (
      <>
        <AdminNavbar />
        {/* <Error404
          errorMessage={errorMessage2}
          backMessage={backMessage}
          route="/adminDashboard"
        /> */}
        <DuckLoading/>
      </>
    );
  }

  else if (itineraries.length === 0 && selectedTab === "Itineraries Report") {
    return (
      <>
        <AdminNavbar />
        <Error404
          errorMessage={errorMessage3}
          backMessage={backMessage}
          route="/adminDashboard"
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
      }}
    >
      <AdminNavbar />
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
      >

        <div>
          <NavigationTabs tabNames={tabs} paths={paths} />
        </div>
        <div style={{ overflowY: "visible", height: "100vh" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom className="bigTitle"
          >
            Revenue Report
          </Typography>
          <br></br>
          <MyTabs tabNames={tabNames} onTabClick={(tabName) => setSelectedTab(tabName)} />

          {selectedTab === "Activities Report" && (
            <div>
              {/* Filtering */}
              <IconButton onClick={activityHandleFilterChoiceClick}>
                <FilterAltIcon style={{ color: "black" }} />
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
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Price
                        <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Is open</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Discount</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Dates and Times</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Flag</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Number of Bookings</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
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
              </TableContainer>{" "}
            </div>
          )}

          {selectedTab === "Itineraries Report" && (
            <div>
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
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Activities
                        <CurrencyConvertor onCurrencyChange={handleActivityCurrencyChange} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Locations</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Timeline</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Language</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Price
                        <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Available Dates And Times</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Accessibility</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Pick Up Location</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Drop Off Location</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Ratings</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Flag</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Active Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Number of Bookings</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Earnings
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
              </TableContainer>{" "}
            </div>
          )}

          {selectedTab === "Products Report" && (
            <div>
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
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Name</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Price
                        <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Rating</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Available Quantity</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Description</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Reviews</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}>Earnings
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
              </TableContainer>{" "}
            </div>
          )}
        </div>
      </div>
    </Box>);
};

export default AdminReport;
