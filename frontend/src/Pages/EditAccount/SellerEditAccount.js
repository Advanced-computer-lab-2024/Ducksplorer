import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';

const EditProfile = () => {
  const [sellerDetails, setSellerDetails] = useState({
    userName: '',
    email: '',
    password: '',
    //nationalId: '',
    name: '',
    description: '',
    taxationRegisteryCard: '',
    logo: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      axios.get(`http://localhost:8000/sellerAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Seller details fetched successfully');
          setSellerDetails({
            ...response.data
          });
        })
        .catch(error => {
          message.error('Error fetching seller details');
          console.error('Error fetching seller details:', error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios.put('http://localhost:8000/sellerAccount/editaccount', sellerDetails)
      .then(response => {
        message.success('Seller details updated successfully');
        console.log('Seller details updated successfully:', response.data);
        setIsEditing(false);
      })
      .catch(error => {
        message.error('Error updating seller details');
        console.error('Error updating seller details:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSellerDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 6 }}>
      <Link to="/sellerDashboard"> Back </Link>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Seller Profile ({sellerDetails.userName})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          name="userName"
          value={sellerDetails.userName}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={sellerDetails.email}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={sellerDetails.password}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Name"
          name="name"
          value={sellerDetails.name}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Description"
          name="description"
          value={sellerDetails.description}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <lable>Taxation Registery Card</lable>
        <FileUpload />
        {/* <TextField
          label="taxationRegisteryCard" // Singular label
          name="taxationRegisteryCard" // This should match the updated state field
          value={sellerDetails.taxationRegisteryCard} // Access the pictures string directly
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
         /> */}
         <lable>Logo</lable>
         <FileUpload />
         {/* <TextField
          label="logo" // Singular label
          name="logo" // This should match the updated state field
          value={sellerDetails.logo} // Access the pictures string directly
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
         /> */}
        {isEditing ? (
          <Button variant="contained" color="success" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" style={{ backdropFiltercolor: '#FFA07A' }} onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditProfile;