import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AdvertiserEditProfile = () => {
  const [advertiserDetails, setAdvertiserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    websiteLink: "",
    hotline: "",
    companyProfile: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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
          sx={{ p: 4, width: "500px", borderRadius: 3, boxShadow: "0px 8px 24px rgba(0,0,0,0.2)" }}
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
              label="Password"
              name="password"
              type="password"
              value={advertiserDetails.password}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
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
        </Paper>
      </Box>
    </div>
  );
};

export default AdvertiserEditProfile;
