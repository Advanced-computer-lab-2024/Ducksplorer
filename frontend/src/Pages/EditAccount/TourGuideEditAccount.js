import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';

const TourGuideEditProfile = () => {
  const [tourGuideDetails, setTourGuideDetails] = useState({
    userName: '',
    email: '',
    password: '',
    //nationalId: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    certificates: '',
    photo: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      axios.get(`http://localhost:8000/tourGuideAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tour Guide details fetched successfully');
          setTourGuideDetails({
            ...response.data
          });
        })
        .catch(error => {
          message.error('Error fetching tour guide details');
          console.error('Error fetching tour guide details:', error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios.put('http://localhost:8000/tourGuideAccount/editaccount', tourGuideDetails)
      .then(response => {
        message.success('Tour Guide details updated successfully');
        console.log('Tour Guide details updated successfully:', response.data);
        setIsEditing(false);
      })
      .catch(error => {
        message.error('Error updating tour guide details');
        console.error('Error updating tour guide details:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTourGuideDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 6 }}>
      <Link to="/tourGuideDashboard"> Back </Link>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Tour Guide Profile ({tourGuideDetails.userName})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          name="userName"
          value={tourGuideDetails.userName}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={tourGuideDetails.email}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={tourGuideDetails.password}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={tourGuideDetails.mobileNumber}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Years of Experience"
          name="yearsOfExperience"
          value={tourGuideDetails.yearsOfExperience}
          type="number"
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Previous Work"
          name="previousWork"
          value={tourGuideDetails.previousWork}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <lable>Certificates</lable>
        <FileUpload />
        {/* <TextField
          label="certificates" // Singular label
          name="certificates" // This should match the updated state field
          value={tourGuideDetails.certificates} // Access the pictures string directly
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
         /> */}
         <lable>Photo</lable>
         <FileUpload />
         {/* <TextField
          label="photo" // Singular label
          name="photo" // This should match the updated state field
          value={tourGuideDetails.photo} // Access the pictures string directly
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

export default TourGuideEditProfile;