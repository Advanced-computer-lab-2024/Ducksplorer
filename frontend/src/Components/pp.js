import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { message } from "antd";

const ProfilePictureUpload = ({ username }) => {
  const [profilePicture, setProfilePicture] = useState("/default-profile.png"); // Default profile picture URL
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Retrieve profile picture from localStorage on mount
  useEffect(() => {
    const storedPicture = localStorage.getItem("profilePicture");
    if (storedPicture) {
      setProfilePicture(storedPicture);
    }
  }, []);

  const handleClickOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("userName", username); // Send userName in the request
    formData.append("file", selectedFile);

    try {
      const response = await axios.put(
        "http://localhost:8000/file/user/upload/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newProfilePicture = URL.createObjectURL(selectedFile);
      setProfilePicture(newProfilePicture); // Update profile picture
      localStorage.setItem("profilePicture", newProfilePicture); // Save to localStorage
      message.success(response.data.message);
      handleClose();
    } catch (error) {
      console.error("Error uploading profile picture", error);
      message.error("Error uploading profile picture");
    }
  };

  const handleViewProfilePicture = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/file/user/profile/picture/${username}`
      );
      if (response.data && response.data.url) {
        setProfilePicture(response.data.url); // Update profile picture with the fetched URL
        localStorage.setItem("profilePicture", response.data.url); // Save to localStorage
        message.success("Profile picture loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading profile picture", error);
      message.error("Error loading profile picture");
    }
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Avatar
          src={profilePicture}
          sx={{ width: 100, height: 100, cursor: "pointer" }}
        />
        <PhotoCameraIcon
          style={{ position: "absolute", bottom: 0, right: 0 }}
        />
      </IconButton>

      {/* Dialog to show options to view or upload a picture */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <Avatar
            src={profilePicture}
            sx={{ width: 150, height: 150, margin: "0 auto" }}
          />
          <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 2 }}>
            {username}
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewProfilePicture} color="primary">
            View Profile Picture
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpload;
