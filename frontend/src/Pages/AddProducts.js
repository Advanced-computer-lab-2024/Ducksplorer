// src/Components/AllProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import ProductDashboard from '../Components/ProductDashboard';

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/getproducts'); // Make sure this matches your backend endpoint
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Add Products     </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Description: {product.description}</Typography>
                <Typography variant="body2">Rating: ${product.rating}</Typography>
                <Typography variant="body2">availableQuantity: ${product.availableQuantity}</Typography>
                <Typography variant="body2">Picture: ${product.picture}</Typography>
                <Typography variant="body2">Seller: ${product.seller}</Typography>
                <Typography variant="body2">reviews: ${product.reviews}</Typography>
                {/* Add more product details as needed */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AddProducts;