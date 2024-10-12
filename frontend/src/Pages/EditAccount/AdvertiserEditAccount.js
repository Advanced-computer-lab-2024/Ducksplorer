import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar";

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
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/advertiserAccount/viewaccount/${userName}`)
        .then((response) => {
          message.success("Advertiser details fetched successfully");
          setAdvertiserDetails({
            ...response.data,
          });
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
      .put(
        "http://localhost:8000/advertiserAccount/editaccount",
        advertiserDetails
      )
      .then((response) => {
        message.success("Advertiser details updated successfully");
        console.log("Advertiser details updated successfully:", response.data);
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
    <div>
      <AdvertiserSidebar />
      <Box
        sx={{
          p: 6,
          transform: "translateY(-150px) translateX(125px)",
          width: "600px",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Edit Your Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            name="userName"
            value={advertiserDetails.userName}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={advertiserDetails.email}
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={advertiserDetails.password}
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Website Link"
            name="websiteLink"
            value={advertiserDetails.websiteLink}
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Hotline"
            name="hotline"
            value={advertiserDetails.hotline}
            type="number"
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          <TextField
            label="Company Profile"
            name="companyProfile"
            value={advertiserDetails.companyProfile}
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
          {isEditing ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveClick}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ backdropFiltercolor: "#FFA07A" }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default AdvertiserEditProfile;
