import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/touristAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tourist details fetched successfully');
          const formattedDOB = response.data.DOB.split('T')[0];
          setTouristDetails({
            ...response.data,
            DOB: formattedDOB,
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
    axios
      .put('http://localhost:8000/touristAccount/editaccount', touristDetails)
      .then(response => {
        message.success('Tourist details updated successfully');
        setIsEditing(false);
      })
      .catch(error => {
        message.error('Error updating tourist details');
        console.error('Error updating tourist details:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTouristDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ p: 3 }}>
        <Link to="/touristDashboard">Back to Dashboard</Link>
      </Box>
      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={4}
          sx={{
            p: 5,
            width: '550px',
            borderRadius: 3,
            boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Edit Tourist Profile
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              name="userName"
              value={touristDetails.userName}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={touristDetails.email}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={touristDetails.password}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={touristDetails.mobileNumber}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Nationality"
              name="nationality"
              value={touristDetails.nationality}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Date of Birth"
              name="DOB"
              type="date"
              value={touristDetails.DOB}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Employment Status"
              name="employmentStatus"
              value={touristDetails.employmentStatus}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Wallet"
              name="wallet"
              value={touristDetails.wallet}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
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
        </Paper>
      </Box>
    </Box>
  );
};

export default EditProfile;
