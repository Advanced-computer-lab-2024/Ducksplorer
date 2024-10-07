import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import ProductDashboard from '../Components/ProductDashboard';
import { TextField, Button, Stack } from '@mui/material';
import ProductCard from '../Components/ProductCard'; // Import the ProductCard component
import { useNavigate } from 'react-router-dom'; // Import to navigate to the edit page
import EditProduct from '../Components/EditProduct';

function ViewMyProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleViewMyProducts = async () => {
    try {
      const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string
      const user = JSON.parse(userJson); 
      const seller = user.username;


      const response = await axios.get(`http://localhost:8000/sellerRoutes/ViewMyProducts/${seller}`

      );
      if (response.status === 200) {
        message.success('Products fetched successfully');
        setProducts(response.data); // Store the filtered products
      } else {
        message.error('Failed to fetch products');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message);
    }
  };

  const handleEditProduct = (productId) => {
    // Navigate to the edit product page with the product ID
    navigate(`/editProduct/${productId}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewMyProducts}
      >
        My Products
      </Button>

      <div style={{ maxHeight: '400px', overflowY: 'visible', padding: '10px', marginTop: '20px' }}>
        {/* Render the filtered products using the ProductCard component */}
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} style={{ position: 'relative', marginBottom: '20px' }}>
              <ProductCard product={product} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEditProduct(product._id)}
                style={{ position: 'absolute', right: '10px', top: '10px' }} // Place the button at the top-right corner
              >
                Edit
              </Button>
            </div>
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

export default ViewMyProducts;
