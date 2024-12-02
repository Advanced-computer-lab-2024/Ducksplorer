//This is the page that gets called when the filter button is clicked inside the upcoming page
import React, { useState, useEffect } from "react";
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Rating,
  Slider,
  Container,
} from "@mui/material";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";

const FilterActivities = () => {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]); // Store all activities
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [averageRating, setAverageRating] = useState(0); // Set default value to 0
  const [categories, setCategories] = useState([]); // Store fetched categories

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  // Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });

    // Fetch all activities when component mounts
    axios
      .get("http://localhost:8000/activity")
      .then((response) => {
        setAllActivities(response.data);
        setActivities(response.data); // Set initial activities to all
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  }, []);

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Function to fetch filtered activities
  const fetchFilteredActivities = () => {
    const query = new URLSearchParams({
      price,
      date,
      category,
    }).toString();

    axios
      .get(`http://localhost:8000/activity/filter?${query}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "#ffffff",
          paddingTop: "2vh", // Adjust for navbar height
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="700">
              Filter Activities
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px", // Adds space between the filter fields
            }}
          >
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ minWidth: 150 }}>
              <Typography variant="body1">Rating: {averageRating}</Typography>
              <Slider
                value={averageRating}
                onChange={(e, newValue) => setAverageRating(newValue)}
                step={1}
                marks={[0, 1, 2, 3, 4, 5].map((value) => ({
                  value,
                  label: value,
                }))}
                min={0}
                max={5}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={fetchFilteredActivities}
            >
              Filter
            </Button>
          </Box>

          <TableContainer style={{ borderRadius: 20 }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    Price
                    <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                  </TableCell>
                  <TableCell>Is Open</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Dates and Times</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) =>
                  activity.flag === false &&
                  activity.advertiserDeleted === false &&
                  activity.deletedActivity === false ? (
                    <TableRow key={activity._id}>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>
                        {(activity.price * (exchangeRates[currency] || 1)).toFixed(2)}{" "}
                      </TableCell>
                      <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell>{activity.tags.join(", ")}</TableCell>
                      <TableCell>{activity.specialDiscount}</TableCell>
                      <TableCell>
                        {activity.date
                          ? (() => {
                              const dateObj = new Date(activity.date);
                              const date = dateObj.toISOString().split("T")[0];
                              const time = dateObj.toTimeString().split(" ")[0];
                              return (
                                <div>
                                  {date} at {time}
                                </div>
                              );
                            })()
                          : "No available date and time"}
                      </TableCell>
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
                  ) : null
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Help />
      </Box>
    </>
  );
};

export default FilterActivities;
