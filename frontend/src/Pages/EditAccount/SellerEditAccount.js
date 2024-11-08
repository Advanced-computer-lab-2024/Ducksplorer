import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';
import ProfilePictureUpload from '../../Components/pp';
import DownloadButton from '../../Components/DownloadButton';

const EditProfile = () => {
  const [sellerDetails, setSellerDetails] = useState({
    userName: '',
    email: '',
    password: '',
    name: '',
    description: '',
    uploads:'',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleUploadsSelect = async () => {
    const uploadsFile = document.getElementById('uploads').files[0];
    console.log("before the call",uploadsFile);
    sellerDetails.uploads = await handleFileUpload(uploadsFile);
  };
  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      axios.get(`http://localhost:8000/sellerAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Seller details fetched successfully');
          setSellerDetails({
            ...response.data
          });
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
      message.success('File uploaded successfully you can now click save');
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
    axios.put('http://localhost:8000/sellerAccount/editaccount', sellerDetails)
      .then(response => {
        message.success('Seller details updated successfully');
        console.log('Seller details updated successfully:', response.data);
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
  const handleFileDelete = async (uploads) => {
    const userName = sellerDetails.userName; // assuming userName is stored in AdvertiserDetails
  
    if (!userName) {
      message.error('Username is missing');
      return;
    }
  
    try {
      await axios.post(`http://localhost:8000/sellerAccount/removeFileUrl`, {
        userName: userName,
        uploads: uploads // using "uploads" to match the backend parameter
      });
      message.success('File deleted successfully');
  
      // Remove the file URL from the state
      setSellerDetails(prevDetails => ({
        ...prevDetails,
        [uploads]: '', // clears the correct field in the state
      }));
    } catch (error) {
      message.error('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };
  
  
  return (
    <Box sx={{ p: 6 }}>
      <Link to="/sellerDashboard"> Back </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ProfilePictureUpload username={sellerDetails.userName} />
        </Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Seller Profile ({sellerDetails.userName})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          name="userName"
          value={sellerDetails.userName}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={sellerDetails.email}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={sellerDetails.password}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Name"
          name="name"
          value={sellerDetails.name}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Description"
          name="description"
          value={sellerDetails.description}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <Box disabled={!isEditing} sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <label>Uploads:</label>
          <DownloadButton fileUrl={sellerDetails.uploads} label="Download uploaded file" />
          <Button onClick={() => handleFileDelete('uploads')}>Delete uploaded file</Button>
          <FileUpload          
            inputId="uploads"
            onFileSelect={handleUploadsSelect}            />
          </Box>

        {isEditing ? (
          <Button variant="contained" color="success" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" style={{ backdropFiltercolor: '#FFA07A' }} onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditProfile;