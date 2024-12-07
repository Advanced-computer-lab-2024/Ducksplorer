import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  // CircularProgress,
} from "@mui/material";
import axios from "axios";
import { message } from "antd";
import { Link } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileUpload from "../../Components/FileUpload";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
import sellerNavBar from "../../Components/NavBars/SellerNavBar";
// import ProfilePictureUpload from "../../Components/pp";
import DownloadButton from "../../Components/DownloadButton";
import SellerNavBar from "../../Components/NavBars/SellerNavBar";

const EditProfile = () => {
  const [sellerDetails, setSellerDetails] = useState({
    userName: "",
    email: "",
    password: "",
    name: "",
    description: "",
    uploads: "",
    photo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handlePhotoUpload = async () => {
    const photoFile = document.getElementById("photo").files[0];
    const formData = new FormData();
    formData.append("file", photoFile);

    try {
      message.success("Uploading photo...");
      const response = await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSellerDetails((prevDetails) => ({
        ...prevDetails,
        photo: response.data.url,
      }));
      message.success("Photo uploaded successfully");
    } catch (error) {
      message.error("Error uploading photo");
    }
  };

  const handlePhotoDelete = () => {
    try {
      setSellerDetails((prevDetails) => ({ ...prevDetails, photo: "" }));
      message.success("Photo deleted successfully");
    } catch (error) {
      message.error("Error deleting photo");
    }
  };

  const handleUploadsSelect = async () => {
    const uploadsFile = document.getElementById("uploads").files[0];
    console.log("before the call", uploadsFile);
    sellerDetails.uploads = await handleFileUpload(uploadsFile);
  };
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/sellerAccount/viewaccount/${userName}`)
        .then((response) => {
          message.success("Seller details fetched successfully");
          setSellerDetails({ ...response.data });
        })
        .catch((error) => {
          message.error("Error fetching seller details");
          console.error("Error fetching seller details:", error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleFileUpload = async (uploads) => {
    const formData = new FormData();
    formData.append("file", uploads);
    try {
      message.success("uploading file please wait");
      const response = await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("File uploaded successfully you can now click save");
      console.log(response.data.url);
      console.log("Document uploaded successfully:", response.data);
      return response.data.url; // Return the file URL
    } catch (error) {
      message.error("Error uploading document");
      console.log("fel catch", error.response.data);
      console.error("Error uploading document for tourguide:", error);
      return null; // Return null if upload fails
    }
  };
  const handleSaveClick = () => {
    axios
      .put("http://localhost:8000/sellerAccount/editaccount", sellerDetails)
      .then((response) => {
        message.success("Seller details updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        message.error("Error updating seller details");
        console.error("Error updating seller details:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSellerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleFileDelete = async (uploads) => {
    const userName = sellerDetails.userName; // assuming userName is stored in AdvertiserDetails

    if (!userName) {
      message.error("Username is missing");
      return;
    }

    try {
      await axios.post(`http://localhost:8000/sellerAccount/removeFileUrl`, {
        userName: userName,
        uploads: uploads, // using "uploads" to match the backend parameter
      });
      message.success("File deleted successfully");

      // Remove the file URL from the state
      setSellerDetails((prevDetails) => ({
        ...prevDetails,
        [uploads]: "", // clears the correct field in the state
      }));
    } catch (error) {
      message.error("Error deleting file");
      console.error("Error deleting file:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <SellerNavBar />
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 500,
          borderRadius: 3,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar src={sellerDetails.photo} sx={{ width: 80, height: 80 }} />
            {isEditing && (
              <>
                <input
                  type="file"
                  id="photo"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="photo">
                  <Button component="span" color="primary" variant="contained">
                    Upload New Photo
                  </Button>
                </label>
                {sellerDetails.photo && (
                  <Button
                    onClick={handlePhotoDelete}
                    color="secondary"
                    variant="contained"
                  >
                    Delete Photo
                  </Button>
                )}
              </>
            )}
          </Box>

          <Typography variant="h5" sx={{ mt: 2 }}>
            Edit Seller Profile
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
            type={showPassword ? "text" : "password"} // Toggle password visibility
            value={sellerDetails.password}
            height="50"
            width="20"
            onChange={handleChange}
            InputProps={{
              readOnly: !isEditing,

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                      style={{ color: "#602b37", fontSize: "40px" }}
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
          <Box disabled={!isEditing} sx={{ display: "flex", gap: 2, mt: 3 }}>
            <label>Uploads:</label>
            <DownloadButton
              fileUrl={sellerDetails.uploads}
              label="Download uploaded file"
            />
            {isEditing && (
              <>
                <Button onClick={() => handleFileDelete("uploads")}>
                  Delete uploaded file
                </Button>
                <FileUpload
                  inputId="uploads"
                  onFileSelect={handleUploadsSelect}
                />
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {isEditing ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveClick}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProfile;
