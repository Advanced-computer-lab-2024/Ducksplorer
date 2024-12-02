import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

function MuseumSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleMuseumSearch = async () => {
    console.log("Search term:", searchTerm);

    try {
      const response = await axios.get('http://localhost:8000/museum/searchMuseum', {
        params: {
          searchTerm,
        },
      });

      console.log("Backend Response:", response);

      if (response.status === 200) {
        onSearch(response.data.results);
      } else {
        alert('No museums found. Try refining your search.');
        onSearch([]);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, width: '100%' }}>
        <Input
          color="primary"
          variant="outlined"
          placeholder="Search for a museum..."
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          size="lg"
        />
        <Button
          variant="solid"
          color="primary"
          onClick={handleMuseumSearch}
          sx={{ ml: 2 }}
        >
          Search
        </Button>
      </Box>
  );
}

export default MuseumSearch;