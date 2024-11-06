import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, IconButton, Dialog, DialogTitle, DialogActions, DialogContent, Button, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { message } from 'antd';

const ProfilePictureUpload = ({ username }) => {
  const [profilePicture, setProfilePicture] = useState('/default-profile.png');  // Default profile picture URL
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    formData.append('userName', username);  // Send userName in the request
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/file/user/upload/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfilePicture(URL.createObjectURL(selectedFile));  // Update profile picture
      message.success(response.data.message);
      handleClose();
    } catch (error) {
      console.error("Error uploading profile picture", error);
      message.error("Error uploading profile picture");
    }
  };

  const handleViewProfilePicture = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/file/user/profile/picture/${username}`);
      if (response.data && response.data.url) {
        setProfilePicture(response.data.url);  // Update profile picture with the fetched URL
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
          sx={{ width: 100, height: 100, cursor: 'pointer' }}
        />
        <PhotoCameraIcon style={{ position: 'absolute', bottom: 0, right: 0 }} />
      </IconButton>

      {/* Dialog to show options to view or upload a picture */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <Avatar
            src={profilePicture}
            sx={{ width: 150, height: 150, margin: '0 auto' }}
          />
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 2 }}>
            {username}
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewProfilePicture} color="primary">View Profile Picture</Button>
          <Button onClick={handleUpload} color="primary">Upload</Button>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpload;
