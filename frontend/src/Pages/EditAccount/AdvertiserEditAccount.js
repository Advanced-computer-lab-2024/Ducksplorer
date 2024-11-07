import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import { Link } from 'react-router-dom';
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileUpload from '../../Components/FileUpload';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../Components/TopNav/iconify.js';
import ProfilePictureUpload from "../../Components/pp";

const AdvertiserEditProfile = () => {
  const [advertiserDetails, setAdvertiserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    websiteLink: "",
    hotline: "",
    companyProfile: "",
    taxationRegisteryCard: '',
    logo: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/advertiserAccount/viewaccount/${userName}`)
        .then((response) => {
          setAdvertiserDetails({ ...response.data });
        })
        .catch((error) => {
          message.error("Error fetching advertiser details");
          console.error("Error fetching advertiser details:", error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios
      .put("http://localhost:8000/advertiserAccount/editaccount", advertiserDetails)
      .then(() => {
        message.success("Advertiser details updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        message.error("Error updating advertiser details");
        console.error("Error updating advertiser details:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAdvertiserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <AdvertiserSidebar />
      <Box sx={{ flexGrow: 1, p: 5, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={4}
          sx={{
            p: 4, width: "700px", borderRadius: 3, boxShadow: "0px 8px 24px rgba(0,0,0,0.2)", '@media (max-width: 768px)': {
              width: "500%"
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Edit Profile
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Username"
              name="userName"
              value={advertiserDetails.userName}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={advertiserDetails.email}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              value={advertiserDetails.password}
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
              label="Website Link"
              name="websiteLink"
              value={advertiserDetails.websiteLink}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Hotline"
              name="hotline"
              value={advertiserDetails.hotline}
              type="number"
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Company Profile"
              name="companyProfile"
              value={advertiserDetails.companyProfile}
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
          value={advertiserDetails.taxationRegisteryCard} // Access the pictures string directly
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
          value={advertiserDetails.logo} // Access the pictures string directly
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
         /> */}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
            <Link to="/advertiserDashboard" style={{ textDecoration: 'none', color: 'primary.main' }}>Back to Dashboard</Link>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default AdvertiserEditProfile;