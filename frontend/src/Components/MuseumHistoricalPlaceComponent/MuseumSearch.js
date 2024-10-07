import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Button, TextField } from '@mui/material';

function MuseumSearch({ onSearch }) {
  const [museumName, setMuseumName] = useState('');
  const [museumCategory, setMuseumCategory] = useState('');
  const [tags, setTags] = useState('');

  const handlemuseumSearch = async () => {
    // Ensure at least one field is filled
    if (!museumName && !museumCategory && !tags) {
      message.error('Please enter at least one search criterion (Name, Category, or Tags).');
      return;
    }

    // Log the parameters being sent to the backend
    console.log("Search parameters:", {
        museumName,
        museumCategory,
        tags,
    });

    try {
      const response = await axios.get('http://localhost:8000/museum/searchMuseum', {
        params: {
          name: museumName || undefined, // Changed to 'name'
          category: museumCategory || undefined, // Changed to 'category'
          tag: tags || undefined, // Changed to 'tag'
        },
      });

      console.log("Backend Response:", response); // Log the response

      if (response.status === 200 && response.data.results.length > 0) { // Adjusted to check for 'results'
        message.success('Museum found');
        onSearch(response.data.results);  // Pass the search results to the parent component
      } else {
        message.error('No Museums found. Try refining your search.');
        onSearch([]);  // Clear the parent table if no results
      }
    } catch (error) {
      console.error('Error during API call:', error);
      message.error('An error occurred: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Search Museum</h2>
      <TextField
        label="Enter Name"
        value={museumName}
        onChange={(e) => setMuseumName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Enter Category"
        value={museumCategory}
        onChange={(e) => setMuseumCategory(e.target.value)}
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
        onClick={handlemuseumSearch}
        style={{ marginTop: '20px' }}
      >
        Search Museum
      </Button>
    </div>
  );
}

export default MuseumSearch;
