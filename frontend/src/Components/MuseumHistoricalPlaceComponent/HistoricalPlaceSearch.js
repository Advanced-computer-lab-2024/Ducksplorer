import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Button, TextField } from '@mui/material';

function HistoricalPlaceSearch({ onSearch }) {
  const [HistoricalPlaceName, setHistoricalPlaceName] = useState('');
  const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleHistoricalPlaceSearch = async () => {
    // Ensure at least one field is filled
    if (!HistoricalPlaceName && !HistoricalPlaceCategory && !tags) {
      message.error('Please enter at least one search criterion (Name, Category, or Tags).');
      return;
    }

    // Log the parameters being sent to the backend
    console.log("Search parameters:", {
      HistoricalPlaceName,
      HistoricalPlaceCategory,
      tags,
    });

    try {
      const response = await axios.get('http://localhost:8000/historicalPlace/searchHistoricalPlace', {
        params: {
          name: HistoricalPlaceName || undefined, // Changed to 'name'
          category: HistoricalPlaceCategory || undefined, // Changed to 'category'
          tag: tags || undefined, // Changed to 'tag'
        },
      });

      console.log("Backend Response:", response); // Log the response

      if (response.status === 200 && response.data.results.length > 0) { // Adjusted to check for 'results'
        message.success('Historical places found');
        onSearch(response.data.results);  // Pass the search results to the parent component
      } else {
        message.error('No historical places found. Try refining your search.');
        onSearch([]);  // Clear the parent table if no results
      }
    } catch (error) {
      console.error('Error during API call:', error);
      message.error('An error occurred: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Search Historical Places</h2>
      <TextField
        label="Enter Name"
        value={HistoricalPlaceName}
        onChange={(e) => setHistoricalPlaceName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Enter Category"
        value={HistoricalPlaceCategory}
        onChange={(e) => setHistoricalPlaceCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Enter Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleHistoricalPlaceSearch}
        style={{ marginTop: '20px' }}
      >
        Search Historical Places
      </Button>
    </div>
  );
}

export default HistoricalPlaceSearch;
