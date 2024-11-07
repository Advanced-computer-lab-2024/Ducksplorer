import React, { useEffect, useState } from "react";
import axios from "axios";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Rating,
} from "@mui/material";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
const SortActivities = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order
  
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState('EGP');
  // Function to fetch sorted activities
  const fetchSortedActivities = () => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    console.log(showPreferences);
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        console.log(showPreferences,"before if");
        if(showPreferences){
          console.log(showPreferences,"inside if");
          let Activities = response.data;
        Activities = Activities.sort((a, b) => {
          if (a.category === favCategory && b.category !== favCategory) {
            return -1; // "restaurant" category comes first
          } else if (b.category === favCategory && a.category !== favCategory) {
            return 1; // Move other categories after "restaurant"
          } else {
            return 0; // If both have the same category, retain their relative order
          }
        });
        setActivities(Activities);

        }else{
          setActivities(response.data);
        }
        
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Fetch activities on initial load
  useEffect(() => {
    // Fetch initial activities if needed
    fetchSortedActivities(); // Optional: Remove this line if you only want to load activities after clicking Sort
  }, []);

  return (
    <>
      <Box
        sx={{
          p: 6,
          maxWidth: "110vh",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Upcoming Activities</Typography>
        </Box>

        {/* Sorting Controls */}
        <Box
          sx={{
            display: "flex",
            overflowY: "visible",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="specialDiscount">Discount</MenuItem>
              <MenuItem value="averageRating">Rating</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="order-label">Order</InputLabel>
            <Select
              labelId="order-label"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={fetchSortedActivities}
          >
            Sort
          </Button>
        </Box>

        {/* Activity Table */}
        <TableContainer style={{ borderRadius: 20 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price
                <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Is open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>                    
                  {(activity.price * (exchangeRates[currency] || 1)).toFixed(2)} {currency}
                  </TableCell>
                  <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags.join(", ")}</TableCell>
                  <TableCell>{activity.specialDiscount}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>
                    <Rating
                      value={activity.averageRating}
                      precision={0.1}
                      readOnly
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default SortActivities;
