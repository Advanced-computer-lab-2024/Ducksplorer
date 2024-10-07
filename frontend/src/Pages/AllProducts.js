import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import ProductDashboard from '../Components/ProductDashboard';
import { TextField, Button, Stack } from '@mui/material';
import ProductCard from '../Components/ProductCard'; // Import the ProductCard component


function AllProducts() {
  const [products,setProducts] = useState([]);

  const handleAllProducts = async () =>{
    try{
      const response = await axios.get('http://localhost:8000/adminRoutes/getproducts');
      if (response.status === 200) {
        message.success('Products fetched successfully');
        setProducts(response.data); // Store the filtered products
      } else {
        message.error('Failed to filter products');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message);
    }
    
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };


  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Button onClick={handleBackButtonClick}>Back</Button>

      <Button
          variant="contained"
          color="primary"
          onClick={handleAllProducts}
        >
          Products
        </Button>

      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', marginTop: '20px' }}>
        {/* Render the filtered products using the ProductCard component */}
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: '20px' }}>
            No products found.
          </Typography>
        )}
      </div>
    </div>
  );



}


export default AllProducts;