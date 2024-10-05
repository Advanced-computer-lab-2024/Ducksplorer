import React, { useState } from 'react';
import axios from 'axios';
import { Box, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

const SearchActivities = () => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Single search input

  // Function to fetch activities based on search criteria
  const fetchSearchedActivities = () => {
    const query = new URLSearchParams({
      search: searchQuery, // Single search query sent to the backend
    }).toString();

    axios.get(`http://localhost:8000/activity?${query}`)
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
          <Typography variant="h4">Search Activities</Typography>
        </Box>

        {/* Search Form */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Single Search Bar */}
          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or tag"
            fullWidth
            sx={{ minWidth: 150 }}
          />

          {/* Search Button */}
          <Button variant="contained" color="primary" onClick={fetchSearchedActivities} sx={{ ml: 2 }}>
            Search
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

export default SearchActivities;
