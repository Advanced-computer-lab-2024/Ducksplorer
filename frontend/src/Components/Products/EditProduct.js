import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Stack } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';

 
const EditProduct =  () =>{
  const {productId} = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [picture, setPicture] = useState('');
  const [description, setDescription] = useState('');
  
  const handleEdit = async () =>{
    const data = {};

    if (name !== '') data.name = name;
    if (price !== '') data.price = price;
    if (availableQuantity !== '') data.availableQuantity = availableQuantity;
    if (picture !== '') data.picture = picture;
    if (description !== '') data.description = description;


    try{
      const response = await axios.put(`http://localhost:8000/sellerRoutes/editProduct/${productId}`, data);
      if (response.status === 200) {
        message.success('Product edited');
      } else {
        message.error('Failed to edit products');
      }
    }catch(error){
      message.error('An error occurred: ' + error.message);
    }


  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div style={{
      backgroundImage: 'url(../../public/Images/bg-intro-desktop.png)', // Update with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Button onClick={handleBackButtonClick}>Back</Button>
     
      <Stack spacing={1} sx={{ width: '600px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }}>
      <div className="trial-btn text-white cursor-pointer" >
        <span className="text-bold"></span>
      </div>
        <TextField
          name="name"
          label="product"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="price"
          label="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          name="available quantity"
          label="available quantity"
          type="number"
          value={availableQuantity}
          onChange={(e) => setAvailableQuantity(e.target.value)}
        />
        <TextField
          name="picture"
          label="picture"
          type="text"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
        <TextField
          name="desription"
          label="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit} // Call function to handle adding the product here
          style={{ marginTop: '10px' }}
        >
          Edit Product
        </Button>
        </Stack>
        </div>
  )
}


export default EditProduct;