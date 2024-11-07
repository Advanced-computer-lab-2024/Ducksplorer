import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../Components/TopNav/iconify.js';
import pp from '../../Components/pp';
import ProfilePictureUpload from '../../Components/pp';

const TourGuideEditProfile = () => {
  const [tourGuideDetails, setTourGuideDetails] = useState({
    userName: '',
    email: '',
    password: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    profilePicture: '',
    files:[]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      try{
      axios.get(`http://localhost:8000/tourGuideAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tour Guide details fetched successfully');
          setTourGuideDetails({ ...response.data });
        })
      }
      catch(error){
          message.error('Error fetching tour guide details');
          console.error('Error fetching tour guide details:', error);
        }
        if (selectedFiles.length > 0) {
          const fileUploadData = new FormData();
          fileUploadData.append('userName', userName);
         selectedFiles.forEach(file => fileUploadData.append('files', file));  // Append each file object directly
         // Log each file appended for document upload
           for (let pair of fileUploadData.entries()) {
               console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
           }

           try {
               axios.post('http://localhost:8000/file/user/upload/documents', fileUploadData, {
                   headers: { 'Content-Type': 'multipart/form-data' },
               });
               message.success('Documents uploaded successfully!');
           } catch (error) {
               console.error('Error uploading documents:', error);
               message.error('Document upload failed: ' + (error.response?.data?.message || error.message));
           }
       }
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
      <Link to="/tourGuideDashboard"> Back </Link>
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
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            value={tourGuideDetails.password}
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