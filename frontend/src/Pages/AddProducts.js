// src/Components/AllProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import ProductDashboard from '../Components/ProductDashboard';
import { TextField, Button, Stack } from '@mui/material';


function AddProducts() {
  const [name , setName] = useState('');
  const [price , setPrice] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [picture , setPicture]= useState('');
  const [description, setDescription] = useState('');
  

  const handleAddProduct = async () => {
    try{
      const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
      const user = JSON.parse(userJson); 
      const userName = user.username;
      const seller = userName;
      const response = await axios.post('http://localhost:8000/adminRoutes/createProducts' , {
        name,
        price,
        ratings: [],
        availableQuantity,
        picture,
        description,
        seller,
        reviews: []
      });
      if (response.status === 200){
        message.success('product added successfully');
      } else{
        message.error('failed to add admin');
      }
    }catch (error){
      message.error('an error occured: '+error.message);
    }
  };


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Add Product</h2>
      <Stack spacing={2}>
        <TextField
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Available Quantity"
          type="number"
          value={availableQuantity}
          onChange={(e) => setAvailableQuantity(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Picture URL"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct} // Call function to handle adding the product here
          style={{ marginTop: '10px' }}
        >
          Add Product
        </Button>
      </Stack>
    </div>
  )
}

export default AddProducts;