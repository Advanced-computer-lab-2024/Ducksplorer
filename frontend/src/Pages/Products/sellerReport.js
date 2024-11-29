////This is the page that gets called for the seller to see HIS products ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import SellerSidebar from "../../Components/Sidebars/SellerSidebar.js";
import { message } from 'antd';

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
  FormControlLabel
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const MyPurchases = () => {
  // Accept userNameId as a prop
  const userName = JSON.parse(localStorage.getItem("user")).username;
  const [products, setProducts] = useState([]);
  //filtering consts
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [filterType, setFilterType] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [loading, setLoading] = useState(false);  // State for loading status
  const [errorMessage, setErrorMessage] = useState("");  // State for error message

  // Handle fetching products by userName ID
  useEffect(() => {
    console.log(userName);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/sellerRoutes/report/${userName}`
        );
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("There was an error fetching the products!", error);
        message.error("error in fetching");
      }
    };
    fetchProducts();
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
      const response = await axios.get(`http://localhost:8000/sellerRoutes/report/${userName}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error resetting products:", error);
    }
    handleFilterClose();
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message before fetching

    try {
      let queryString = '';

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
      queryString = queryString.endsWith('&') ? queryString.slice(0, -1) : queryString;

      // Fetch products with the constructed query string
      const response = await axios.get(`http://localhost:8000/sellerRoutes/filterReport/${userName}?${queryString}`);

      setProducts(response.data);

      if (response.data.length === 0) {
        setErrorMessage("No products found for the selected filters.");
      }
    } catch (error) {
      setErrorMessage("Error fetching products!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filtersApplied) return;
    if (!date && !month && !year) return;
    fetchFilteredProducts();
  }, [filtersApplied, date, month, year]);

  const generateYearOptions = () => {
    const startYear = 2030;
    const numOptions = 50; // Limit to 50 options
    return Array.from({ length: numOptions }, (_, i) => startYear - i).filter((year) => year >= 0);
  };


  const [priceExchangeRates, setPriceExchangeRates] = useState({});
  const [priceCurrency, setPriceCurrency] = useState('EGP');

  const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
  const [earningsCurrency, setEarningsCurrency] = useState('EGP');

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
  }

  const changeMonth = (newMonth) => {
    setMonth(newMonth);
    setDate(""); // Reset date if month is selected
    setFiltersApplied(true);
  }

  const changeYear = (newYear) => {
    setYear(newYear);
    setDate(""); // Reset date if month is selected
    setFiltersApplied(true);
  }

  const getReviewerRating = (reviewer) => {
    const ratingEntry = products.ratings.find(
      (rating) => rating.buyer === reviewer
    );
    return ratingEntry ? ratingEntry.rating : "No rating available";
  };


  return (
    <>
      <SellerSidebar />
      <div>
        <Box sx={{ p: 6, maxWidth: "120vh", overflowY: "visible", height: "100vh", marginLeft: "350px", }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Typography variant="h4">Advertiser Report</Typography>
          </Box>
          {/* Filtering */}
          <IconButton onClick={handleFilterChoiceClick}>
            <FilterAltIcon />
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
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel>Month</InputLabel>
                          <Select
                            value={month}
                            onChange={(e) => {
                              changeMonth(e.target.value)
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
                              changeYear(e.target.value)
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
                  <TableCell>Date</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Flag</TableCell>
                  <TableCell>Earnings
                    <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((productBooking) =>
                    productBooking.product ? (
                      <TableRow key={productBooking.product._id}>
                        <TableCell>{productBooking.product.name}</TableCell>
                        <TableCell>
                          {(productBooking.chosenPrice * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                        </TableCell>
                        <TableCell>
                          <Rating
                            value={calculateAverageRating(productBooking.product.ratings)}
                            precision={0.1}
                            readOnly
                          />
                        </TableCell>
                        <TableCell>{productBooking.product.availableQuantity}</TableCell>
                        <TableCell>{productBooking.product.description}</TableCell>
                        <TableCell>{Object.entries(productBooking.product.reviews).length > 0 ? (
                          Object.entries(productBooking.product.reviews).map(([user, review]) => (
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
                          {productBooking.chosenDate ? (() => {
                            const dateObj = new Date(productBooking.chosenDate);
                            const date = dateObj.toISOString().split('T')[0];
                            const time = dateObj.toTimeString().split(' ')[0];
                            return (
                              <div>
                                {date}
                              </div>
                            );
                          })() : 'No available date'}
                        </TableCell>
                        <TableCell>{productBooking.chosenQuantity}</TableCell>
                        <TableCell>
                          {productBooking.product.flag ? (
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
                          {((productBooking.chosenPrice * 0.9) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
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
    </>
  );
};

export default MyPurchases;
