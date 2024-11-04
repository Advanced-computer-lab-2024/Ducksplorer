import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import CategoriesDropDown from "Ducksplorer/frontend/src/Components/CategoryDropDown";


const EditProfile = () => {
  const [touristDetails, setTouristDetails] = useState({
    userName: '',
    email: '',
    password: '',
    mobileNumber: '',
    nationality: '',
    DOB: '', 
    employmentStatus: '',
    wallet: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      axios.get(`http://localhost:8000/touristAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tourist details fetched successfully');
          const formattedDOB = response.data.DOB.split('T')[0]; // Convert "2004-03-17T00:00:00.000Z" to "2004-03-17"
          setTouristDetails({
            ...response.data,
            DOB: formattedDOB // Ensure DOB is in "yyyy-MM-dd" format
          });
        })
        .catch(error => {
          message.error('Error fetching tourist details');
          console.error('Error fetching tourist details:', error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios.put('http://localhost:8000/touristAccount/editaccount', touristDetails)
      .then(response => {
        message.success('Tourist details updated successfully');
        console.log('Tourist details updated successfully:', response.data);
        setIsEditing(false);
      })
      .catch(error => {
        message.error('Error updating tourist details');
        console.error('Error updating tourist details:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTouristDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 6 }}>
      <Link to="/touristDashboard"> Back </Link>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Tourist Profile ({touristDetails.userName})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          name="userName"
          value={touristDetails.userName}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={touristDetails.email}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={touristDetails.password}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={touristDetails.mobileNumber}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Nationality"
          name="nationality"
          value={touristDetails.nationality}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Date of Birth"
          name="DOB"
          type="date"
          value={touristDetails.DOB}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Employment Status"
          name="employmentStatus"
          value={touristDetails.employmentStatus}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
            label="Wallet"
            name="wallet"
            value={touristDetails.wallet}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
        />
        <CategoriesDropDown />    
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