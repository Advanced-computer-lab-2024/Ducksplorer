import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { message } from 'antd';

function HistoricalPlaceSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleHistoricalPlaceSearch = async () => {
    console.log("Search term:", searchTerm);

    try {
      const response = await axios.get('http://localhost:8000/historicalPlace/searchHistoricalPlace', {
        params: {
          searchTerm,
        },
      });

      console.log("Backend Response:", response);

      if (response.status === 200) {
        onSearch(response.data.results);
      } else {
        message.error('No historical places found. Try refining your search.');
        onSearch([]);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      message.error('An error occurred: ' + error.message);
    }
  };

  return (
    <Box sx={{ padding: '20px', width: '100%', margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Input
          color="primary"
          variant="outlined"
          placeholder="Search for a historical place..."
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          size="lg"
        />
        <Button
          variant="solid"
          color="primary"
          onClick={handleHistoricalPlaceSearch}
          sx={{ ml: 2 }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}

export default HistoricalPlaceSearch;
