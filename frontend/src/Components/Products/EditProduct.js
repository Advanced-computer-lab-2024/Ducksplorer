import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Stack, CircularProgress, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { get } from "mongoose";
import UploadFile from "../ProductUploadImage";

let picture = "";

const EditProduct = () => {
  const { productId } = useParams();
  const [URL, setURL] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    availableQuantity: '',
    picture: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/sellerRoutes/product/${productId}`);
        setFormData(response.data); 
        setLoading(false);
        picture = response.data.picture;
      } catch (error) {
        message.error('Failed to load product data');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpload = (url) => {
    setURL(url);
    picture = url;
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/sellerRoutes/editProduct/${productId}`, formData);
      if (response.status === 200) {
        message.success('Product edited successfully');
      } else {
        message.error('Failed to edit product');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message);
    }
  };
  const handleBackButtonClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://example.com/background-image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        overflowY: 'visible'
      }}
    >
      <Button onClick={handleBackButtonClick}>Back</Button>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 600,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2, color: '#00796b', fontWeight: 'bold' }}>
          Edit Product
        </Typography>

        <div className="trial-btn text-white cursor-pointer">
          <span className="text-bold"></span>
        </div>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            name="price"
            label="Price ($)"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            name="availableQuantity"
            label="Available Quantity"
            type="number"
            value={formData.availableQuantity}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
         <div style={{ borderRadius: "3cap" }}>
          <img
            name="picture"
            label="picture"
            type="text"
            src={picture}
            style={{
              maxWidth: "500px",
              borderRadius: "3cap",
            }}
          />
        </div>
        <UploadFile onUpload={handleUpload} />
          <TextField
            name="description"
            label="Description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            fullWidth
            sx={{
              backgroundColor: '#00796b',
              ':hover': {
                backgroundColor: '#005a4f',
              },
              fontWeight: 'bold',
              py: 1.5,
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditProduct;
