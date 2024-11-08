import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';
import ProfilePictureUpload from '../../Components/pp';
import DownloadButton from '../../Components/DownloadButton';
const TourGuideEditProfile = () => {
  const [tourGuideDetails, setTourGuideDetails] = useState({
    userName: '',
    email: '',
    password: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    nationalId: '',
    certificates: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [nationalIdFiles, setNationalIdFiles] = useState(null);
  const [certificatesFiles, setCertificatesFiles] = useState(null);


  const handleNationalIdSelect = async () => {
    const nationalIdFile = document.getElementById('nationalIdUpload').files[0];
    // setNationalIdFiles(file);
    tourGuideDetails.nationalId = await handleFileUpload(nationalIdFile);
  };

  const handleCertificatesSelect = async () => {
    const certificatesFile = document.getElementById('certificateUpload').files[0];
    // setCertificatesFiles(file);
    console.log("before the call",certificatesFile);
    tourGuideDetails.certificates = await handleFileUpload(certificatesFile);
  };

  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 

    if (userName) {
      try{
      axios.get(`http://localhost:8000/tourGuideAccount/viewaccount/${userName}`)
        .then(response => {
          message.success('Tour Guide details fetched successfully');
          setTourGuideDetails({
            ...response.data
          });
        })
        // console.log('National ID URL:', tourGuideDetails.nationalIdUrl);
        // console.log('Certificates URL:', tourGuideDetails.certificatesUrl);

      }
      catch(error){
          message.error('Error fetching tour guide details');
          console.error('Error fetching tour guide details:', error);
        }
        
  }


  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setTourGuideDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
  const handleFileUpload = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      console.log("gowa upload doc2",formData);
      try {
        message.success("uploading file please wait");
        const response = await axios.post('http://localhost:8000/api/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('File uploaded successfully');
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
    axios.put('http://localhost:8000/tourGuideAccount/editaccount', tourGuideDetails)
      .then(response => {
        message.success('Tour Guide details updated successfully');
        console.log('Tour Guide details updated successfully:', response.data);
        setIsEditing(false);
      })
      .catch(error => {
        message.error('Error updating tour guide details');
        console.error('Error updating tour guide details:', error);
      });
  };
  // File delete handler
  const handleFileDelete = async (fileType) => {
    const userName = tourGuideDetails.userName; // assuming userName is stored in tourGuideDetails
  
    if (!userName) {
      message.error('Username is missing');
      return;
    }
  
    try {
      await axios.post(`http://localhost:8000/tourGuideAccount/removeFileUrl`, {
        userName: userName,
        fileType: fileType
      });
      message.success('File deleted successfully');
  
      // Remove the file URL from the state
      setTourGuideDetails(prevDetails => ({
        ...prevDetails,
        [fileType]: '',
      }));
    } catch (error) {
      message.error('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };
  
  return (
    <Box sx={{ p: 6 }}>
      <Link to="/tourGuideDashboard"> Back </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ProfilePictureUpload username={tourGuideDetails.userName} />
        </Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Tour Guide Profile ({tourGuideDetails.userName})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          name="userName"
          value={tourGuideDetails.userName}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={tourGuideDetails.email}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={tourGuideDetails.password}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={tourGuideDetails.mobileNumber}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Years of Experience"
          name="yearsOfExperience"
          value={tourGuideDetails.yearsOfExperience}
          type="number"
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Previous Work"
          name="previousWork"
          value={tourGuideDetails.previousWork}
          onChange={handleChange}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <Box disabled={!isEditing} sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <label>National ID</label>
          <DownloadButton fileUrl={tourGuideDetails.nationalId} label="Download National ID" />
          <Button onClick={() => handleFileDelete('nationalId')}>Delete National ID</Button>
          <FileUpload          
            inputId="nationalIdUpload"
            onFileSelect={handleNationalIdSelect}            />
          </Box>

        <Box disabled={!isEditing} sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <label>Certificates</label>
          <DownloadButton fileUrl={tourGuideDetails.certificates} label="Download Certificates" />
          <Button onClick={() => handleFileDelete('certificates')}>Delete Certificates</Button>
          <FileUpload
              inputId="certificateUpload"
              onFileSelect={handleCertificatesSelect}            />
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

export default TourGuideEditProfile;