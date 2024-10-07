import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Button, Stack, TextField, Typography } from '@mui/material';
import ProductCard from '../Components/ProductCard'; // Import the ProductCard component

function FilterProducts() {
  const [minPrice, setMinPrice] = useState(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(''); // State for maximum price
  const [products, setProducts] = useState([]);

  const handleFilterProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/adminRoutes/filterProducts', {
        params: {
          minPrice, // Send minPrice as a query parameter
          maxPrice, // Send maxPrice as a query parameter
        },
      });

      if (response.status === 200) {
        message.success('Products filtered successfully');
        setProducts(response.data); // Store the filtered products
      } else {
        message.error('Failed to filter products');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Filter Products by Price Range</h2>
      <Stack spacing={2}>
        <TextField
          label="Enter Minimum Price"
          type="number" // Ensure it's a number field
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          fullWidth
        />
        <TextField
          label="Enter Maximum Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterProducts}
        >
          Filter Products
        </Button>
      </Stack>

      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', marginTop: '20px' }}>
        {/* Render the filtered products using the ProductCard component */}
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: '20px' }}>
            No products found in the specified price range.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default FilterProducts;
