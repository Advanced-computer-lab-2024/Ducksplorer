////This is the page that gets called when the sort activities button is clicked
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

const SortActivities = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order

  // Function to fetch sorted activities
  const fetchSortedActivities = () => {
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
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
                <TableCell>Price</TableCell>
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
              {activities.map((activity) =>
                !activity.flag && (
                  <TableRow key={activity._id}>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.price}</TableCell>
                    <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.tags.join(", ")}</TableCell>
                    <TableCell>{activity.specialDiscount}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>{activity.duration}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>
                      <Rating value={activity.averageRating} precision={0.1} readOnly />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default SortActivities;
