import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TourGuideEditProfile = () => {
  const [tourGuideDetails, setTourGuideDetails] = useState({
    userName: '',
    email: '',
    password: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios.get(`http://localhost:8000/tourGuideAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tour Guide details fetched successfully');
          setTourGuideDetails({ ...response.data });
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
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, width: 500, borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.2)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto' }}>
            <AccountCircleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Edit Tour Guide Profile
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Username"
            name="userName"
            value={tourGuideDetails.userName}
            onChange={handleChange}
            InputProps={{ readOnly: true }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={tourGuideDetails.email}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={tourGuideDetails.password}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Mobile Number"
            name="mobileNumber"
            value={tourGuideDetails.mobileNumber}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Years of Experience"
            name="yearsOfExperience"
            value={tourGuideDetails.yearsOfExperience}
            type="number"
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Previous Work"
            name="previousWork"
            value={tourGuideDetails.previousWork}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {isEditing ? (
            <Button variant="contained" color="success" onClick={handleSaveClick} fullWidth sx={{ py: 1.5 }}>
              Save Changes
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEditClick} fullWidth sx={{ py: 1.5 }}>
              Edit Profile
            </Button>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link to="/tourGuideDashboard" style={{ textDecoration: 'none', color: 'primary.main' }}>Back to Dashboard</Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default TourGuideEditProfile;
