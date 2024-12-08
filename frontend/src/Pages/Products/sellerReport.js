////This is the page that gets called for the seller to see HIS products ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import SellerSidebar from "../../Components/Sidebars/SellerSidebar.js";
import { message } from 'antd';
import Help from "../../Components/HelpIcon.js";
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
  CircularProgress
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SellerNavBar from "../../Components/NavBars/SellerNavBar.js";

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
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/sellerRoutes/report/${userName}`
        );
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("There was an error fetching the products!", error);
        message.error("error in fetching");
      }
      finally {
        setLoading(false);
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
    const product = products.find(p => p.product._id === reviewer);  // Find the product by reviewer ID
    if (product && Array.isArray(product.product.ratings)) {
      const ratingEntry = product.product.ratings.find(
        (rating) => rating.buyer === reviewer
      );
      return ratingEntry ? ratingEntry.rating : "No rating available";
    }
    return "No ratings available";
  };
  

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  if ((!Array.isArray(products)) || (products.length === 0)) {
    return <p>No products available.</p>;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
      }}
    >
      <SellerNavBar />
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
      >
        <div style={{ overflowY: "visible", height: "100vh" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom className="duckTitle"
          >
            Products Report
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
                    Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Price
                    <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Rating</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Available Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Reviews</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Purchase Count</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Earnings
                    <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((entry) =>
                    entry  ? (
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
                          {entry.bookedCount}
                        </TableCell>
                        <TableCell>
                          {((entry.totalEarnings * 0.9) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
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
        </div>
      </div>
    </Box >
  );
};

export default MyPurchases;
