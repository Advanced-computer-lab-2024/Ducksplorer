import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FileUpload from '../../Components/FileUpload';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../Components/TopNav/iconify.js';
import ProfilePictureUpload from '../../Components/pp';

const EditProfile = () => {
  const [sellerDetails, setSellerDetails] = useState({
    userName: '',
    email: '',
    password: '',
    name: '',
    description: '',
    taxationRegisteryCard: '',
    logo: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios.get(`http://localhost:8000/sellerAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Seller details fetched successfully');
          setSellerDetails({ ...response.data });
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
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Link to="/sellerDashboard"> Back </Link>
      <Paper elevation={4} sx={{ p: 4, width: 500, borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.2)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto' }}>
            <AccountCircleIcon fontSize="large" />
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ProfilePictureUpload username={sellerDetails.userName} />
        </Box>
      <Typography variant="h5" sx={{ mt: 2 }}>
            Edit Seller Profile
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Username"
            name="userName"
            value={sellerDetails.userName}
            onChange={handleChange}
            InputProps={{ readOnly: true }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={sellerDetails.email}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            value={sellerDetails.password}
            height="50"
            width="20"
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)} edge="end"
                  >
                    <Iconify
                      icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                      style={{ color: '#602b37', fontSize: '40px' }}
                    />
                  </IconButton>
                </InputAdornment>
              ),

            }}
          />
          <TextField
            label="Name"
            name="name"
            value={sellerDetails.name}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={sellerDetails.description}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
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
          <Link to="/sellerDashboard" style={{ textDecoration: 'none', color: 'primary.main' }}>Back to Dashboard</Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProfile;