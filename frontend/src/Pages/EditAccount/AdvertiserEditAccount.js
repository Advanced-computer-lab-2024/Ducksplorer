import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar";
import FileUpload from '../../Components/FileUpload';
import ProfilePictureUpload from "../../Components/pp";
import DownloadButton from '../../Components/DownloadButton';

const AdvertiserEditProfile = () => {
  const [advertiserDetails, setAdvertiserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    websiteLink: "",
    hotline: "",
    companyProfile: "",
    uploads:"",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleUploadsSelect = async () => {
    const uploadsFile = document.getElementById('uploads').files[0];
    console.log("before the call",uploadsFile);
    advertiserDetails.uploads = await handleFileUpload(uploadsFile);
  };

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

  const handleFileUpload = async (uploads) => {
    const formData = new FormData();
    formData.append('file', uploads);
    try {
      message.success("uploading file please wait");
      const response = await axios.post('http://localhost:8000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('File uploaded successfully, you can now click save');
      console.log(response.data.url);
      console.log('Document uploaded successfully:', response.data);
      return response.data.url; // Return the file URL
    } catch (error) {
      message.error('Error uploading document');
      console.log("fel catch",error.response.data);
      console.error('Error uploading document for tourguide:', error);
      return null; // Return null if upload fails
    }
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
  const handleFileDelete = async (uploads) => {
    const userName = advertiserDetails.userName; // assuming userName is stored in AdvertiserDetails
  
    if (!userName) {
      message.error('Username is missing');
      return;
    }
  
    try {
      await axios.post(`http://localhost:8000/advertiserAccount/removeFileUrl`, {
        userName: userName,
        uploads: uploads // using "uploads" to match the backend parameter
      });
      message.success('File deleted successfully');
  
      // Remove the file URL from the state
      setAdvertiserDetails(prevDetails => ({
        ...prevDetails,
        [uploads]: '', // clears the correct field in the state
      }));
    } catch (error) {
      message.error('Error deleting file');
      console.error('Error deleting file:', error);
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ProfilePictureUpload username={advertiserDetails.userName} />
        </Box>
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
          <Box disabled={!isEditing} sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <label>Uploads:</label>
          <DownloadButton fileUrl={advertiserDetails.uploads} label="Download uploaded file" />
          <Button onClick={() => handleFileDelete('uploads')}>Delete uploaded file</Button>
          <FileUpload          
            inputId="uploads"
            onFileSelect={handleUploadsSelect}            />
          </Box>
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
