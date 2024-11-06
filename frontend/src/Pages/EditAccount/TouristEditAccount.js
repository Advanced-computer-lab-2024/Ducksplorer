import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Avatar } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import TouristNavBar from '../../Components/TouristNavBar.js';
import ProfilePictureUpload from '../../Components/pp.js'; // Import ProfilePictureUpload component

const EditProfile = () => {
  const [touristDetails, setTouristDetails] = useState({
    userName: '',
    email: '',
    mobileNumber: '',
    nationality: '',
    DOB: '', 
    employmentStatus: '',
    wallet: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user');  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      axios.get(`http://localhost:8000/touristAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tourist details fetched successfully');
          const formattedDOB = response.data.DOB.split('T')[0];
          setTouristDetails({
            ...response.data,
            DOB: formattedDOB 
          });
        })
        .catch(error => {
          message.error('Error fetching tourist details');
          console.error('Error fetching tourist details:', error);
        });
    }
  }, []);

  const handleEditClick = () => setIsEditing(true);
  
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
    <>
      <TouristNavBar />
      <Box sx={{ p: 6 }}>
        {/* Profile Picture Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ProfilePictureUpload username={touristDetails.userName} />
        </Box>

        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
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
          {isEditing ? (
            <Button variant="contained" color="success" onClick={handleSaveClick}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditProfile;
