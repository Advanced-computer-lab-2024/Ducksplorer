import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';

const FilterActivities = () => {
  const [activities, setActivities] = useState([]);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [categories, setCategories] = useState([]); // Store fetched categories

  // Fetch categories from backend
  useEffect(() => {
    axios.get('http://localhost:8000/category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  // Function to fetch filtered activities
  const fetchFilteredActivities = () => {
    const query = new URLSearchParams({
      price,
      date,
      category,
      rating,
    }).toString();

    axios.get(`http://localhost:8000/activity/filter?${query}`)
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the activities!', error);
      });
  };

  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Filter Activities</Typography>
        </Box>

        {/* Filter Form */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            type="number"
            sx={{ minWidth: 150 }}
          />
          <Button variant="contained" color="primary" onClick={fetchFilteredActivities}>
            Filter
          </Button>
        </Box>

        {/* Activity Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Is Open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.price}</TableCell>
                  <TableCell>{activity.isOpen ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags}</TableCell>
                  <TableCell>{activity.specialDiscount}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default FilterActivities;
