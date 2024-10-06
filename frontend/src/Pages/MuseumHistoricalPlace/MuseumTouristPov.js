import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MuseumSearch from '../../Components/MuseumHistoricalPlaceComponent/MuseumSearch';
import MuseumFilterComponent from '../../Components/MuseumHistoricalPlaceComponent/MuseumFilterComponent';

import {
  Box,
  Button,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const MuseumTouristPov = () => {
  const [Museums, setMuseums] = useState([]);
  const navigate = useNavigate();

  // Fetch all museums on component mount
  useEffect(() => {
    axios.get(`http://localhost:8000/museum/getAllMuseums`)
      .then(response => {
        setMuseums(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the museums!', error);
        message.error('Error fetching museums!');
      });
  }, []);

  // Callback to handle search results
  const handleSearchResults = (searchResults) => {
    setMuseums(searchResults);  // Update table data with search results
  };

  // Callback to handle filter results
  const handleFilterResults = (filterResults) => {
    setMuseums(filterResults);  // Update table data with filter results
  };

  // Navigate to the upcoming museums page
  const goToUpcomingPage = () => {
    navigate('/UpcomingMuseums');
  };

  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Available Museum Visits</Typography>
        </Box>

        {/* Render the search component and pass the callback */}
        <div>
          <MuseumSearch onSearch={handleSearchResults} />
        </div>

        {/* Render the filter component and pass the callback */}
        <div>
          <MuseumFilterComponent onFilter={handleFilterResults} />
        </div>

        {/* Button to navigate to upcoming museums */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
            Get Upcoming Museum Visits
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Pictures</TableCell>
                <TableCell>Ticket Price</TableCell>
                <TableCell>Opening Time</TableCell>
                <TableCell>Closing Time</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created By</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(Museums) && Museums.length > 0 ? (
                Museums.map(museum => (
                  <TableRow key={museum._id}>
                    <TableCell>{museum.description}</TableCell>
                    <TableCell>{museum.location}</TableCell>
                    <TableCell>
                      <img
                        src={museum.pictures}
                        alt="Museum"
                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                      />
                    </TableCell>
                    <TableCell>{museum.ticketPrices}</TableCell>
                    <TableCell>{museum.openingTime}</TableCell>
                    <TableCell>{museum.closingTime}</TableCell>
                    <TableCell>{museum.museumDate}</TableCell>
                    <TableCell>{museum.museumName}</TableCell>
                    <TableCell>{museum.museumCategory}</TableCell>
                    <TableCell>{museum.tags.join(', ')}</TableCell>
                    <TableCell>{museum.createdBy}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">No museums available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default MuseumTouristPov;
