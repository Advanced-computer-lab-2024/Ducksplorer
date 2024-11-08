// This file contains everything the tourist should see : all historical places of all tourism governors, search filter, and see upcoming historical visits
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import HistoricalPlaceSearch from '../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceSearch';
import HistoricalPlaceFilterComponent from '../../Components/MuseumHistoricalPlaceComponent/HistoricalPlaceFilterComponent';
import { Link, useParams } from 'react-router-dom';
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";

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

const HistoricalPlaceTouristPov = () => {

  const { id } = useParams();

  const [HistoricalPlaces, setHistoricalPlaces] = useState([]);
  const navigate = useNavigate();


  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState('EGP');

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Fetch all museums on component mount
  useEffect(() => {
    axios.get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`)
      .then(response => {
        if (id === undefined) {
          setHistoricalPlaces(response.data);
        }
        else {
          const tempHistoricalPlaces = response.data.filter((historicalPlace) => historicalPlace._id === id);
          setHistoricalPlaces(tempHistoricalPlaces);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the Historical Places!', error);
        message.error('Error fetching Historical Places!');
      });
  }, [id]);

  // Callback to handle search results
  const handleSearchResults = (searchResults) => {
    setHistoricalPlaces(searchResults);  // Update table data with search results
  };

  // Callback to handle filter results
  const handleFilterResults = (filterResults) => {
    setHistoricalPlaces(filterResults);  // Update table data with filter results
  };

  // Navigate to the upcoming museums page
  const goToUpcomingPage = () => {
    navigate('/UpcomingHistoricalPlaces');
  };

  // Share historical place functionality
  const handleShareLink = (HistoricalPlaceId) => {
    const link = `${window.location.origin}/HistoricalPlaceTouristPov/${HistoricalPlaceId}`; // Update with your actual route
    navigator.clipboard.writeText(link)
      .then(() => {
        message.success('Link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy link.');
      });
  };

  const handleShareEmail = (HistoricalPlaceId) => {
    const link = `${window.location.origin}/HistoricalPlaceTouristPov/${HistoricalPlaceId}`; // Update with your actual route
    const subject = 'Check out this historical place';
    const body = `Here is the link to the historical place: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Button component={Link} to="/touristDashboard" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </Button>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Available Historical Place Visits</Typography>
        </Box>

        {/* Render the search component and pass the callback */}
        <div>
          <HistoricalPlaceSearch onSearch={handleSearchResults} />
        </div>

        {/* Render the filter component and pass the callback */}
        <div>
          <HistoricalPlaceFilterComponent onFilter={handleFilterResults} />
        </div>

        {/* Button to navigate to upcoming museums */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
            Get Upcoming Historical Place Visits
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Pictures</TableCell>
                <TableCell>Ticket Price
                <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
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
              {Array.isArray(HistoricalPlaces) && HistoricalPlaces.length > 0 ? (
                HistoricalPlaces.map(historicalPlace => (
                  <TableRow key={historicalPlace._id}>
                    <TableCell>{historicalPlace.description}</TableCell>
                    <TableCell>{historicalPlace.location}</TableCell>
                    <TableCell>
                      <img
                        src={historicalPlace.pictures}
                        alt="HistoricalPlace"
                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                      />
                    </TableCell>
                    <TableCell>
                    {(historicalPlace.ticketPrices * (exchangeRates[currency] || 1)).toFixed(2)} {currency}
                    </TableCell>                   
                    <TableCell>{historicalPlace.openingTime}</TableCell>
                    <TableCell>{historicalPlace.closingTime}</TableCell>
                    <TableCell>{historicalPlace.HistoricalPlaceDate}</TableCell>
                    <TableCell>{historicalPlace.HistoricalPlaceName}</TableCell>
                    <TableCell>{historicalPlace.HistoricalPlaceCategory}</TableCell>
                    <TableCell>{historicalPlace.tags.join(', ')}</TableCell>
                    <TableCell>{historicalPlace.createdBy}</TableCell>
                    {id === undefined ? (<TableCell>
                      <Button variant="outlined" onClick={() => handleShareLink(historicalPlace._id)}>
                        Share Via Link
                      </Button>
                      <Button variant="outlined" onClick={() => handleShareEmail(historicalPlace._id)}>
                        Share Via Email
                      </Button>
                    </TableCell>) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">No Historical Places available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default HistoricalPlaceTouristPov;