import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Button, Stack } from '@mui/material';
import Iconify from './TopNav/iconify.js';
import axios from 'axios';
import { message } from 'antd';
import { useTypeContext } from '../context/TypeContext';
import DropDown from './DropDown.js';
import { useNavigate } from "react-router-dom";
// import FileUpload from './FileUpload';

const FormSection = () => {
  const { type } = useTypeContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // File states
  const [nationalId, setNationalId] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [taxationRegisteryCard, setTaxationRegisteryCard] = useState(null);

  // Additional state variables for conditional fields
  const [mobileNumber, setMobileNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [DOB, setDOB] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [previousWork, setPreviousWork] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [hotline, setHotline] = useState('');
  const [companyProfile, setCompanyProfile] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const validateFields = () => {
    if (!userName || !password || !confirmPassword || !email ) {
      message.error('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return false;
    }
    if (type === 'Tourist' && (!mobileNumber || !nationality || !DOB || !employmentStatus)) {
      message.error('All fields are required for Tourist');
      return false;
    }
    if (type === 'Guide' && (!mobileNumber || !yearsOfExperience || !previousWork )) {
      message.error('All fields are required for Guide');
      return false;
    }
    if (type === 'Advertiser' && (!websiteLink || !hotline || !companyProfile )) {
      message.error('All fields are required for Advertiser');
      return false;
    }
    if (type === 'Seller' && (!name || !description )) {
      message.error('All fields are required for Seller');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('role', type);
    

    // Append conditional fields and documents based on role
    if (type === 'Tourist') {
      formData.append('mobileNumber', mobileNumber);
      formData.append('nationality', nationality);
      formData.append('DOB', DOB);
      formData.append('employmentStatus', employmentStatus);
    } else if (type === 'Guide') {
      formData.append('mobileNumber', mobileNumber);
      formData.append('yearsOfExperience', yearsOfExperience);
      formData.append('previousWork', previousWork);
      //formData.append('certificates', certificates);
      //formData.append('nationalId', nationalId);
    } else if (type === 'Advertiser') {
      formData.append('websiteLink', websiteLink);
      formData.append('hotline', hotline);
      formData.append('companyProfile', companyProfile);
      //formData.append('taxationRegisteryCard', taxationRegisteryCard);
      //formData.append('nationalId', nationalId);
    } else if (type === 'Seller') {
      formData.append('name', name);
      formData.append('description', description);
    //  formData.append('taxationRegisteryCard', taxationRegisteryCard);
      //formData.append('nationalId', nationalId);
    }

    try {
      const response = await axios.post('http://localhost:8000/signUp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Signed Up successfully!');
      navigate('/login');
    } catch (error) {
      message.error('An error occurred: ' + error.response.data.error);
      console.error('There was an error signing up!', error);
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(../../public/Images/bg-intro-desktop.png)', // Update with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflowY: 'auto',
      margin: 0,
    }}>
     
      <Stack spacing={1} sx={{ width: '600px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }}>
      <div className="trial-btn text-white cursor-pointer" >
        <span className="text-bold">Welcome To Ducksplorer</span>
      </div>
        <TextField
          name="username"
          label="Username"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'} // Toggle password visibility
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
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
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'} // Toggle password visibility
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    style={{ color: '#602b37', fontSize: '40px' }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {type === 'Tourist' && (
          <>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <TextField
              name="nationality"
              label="Nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
            <TextField
              name="DOB"
              label="Date of Birth"
              type="date"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="employmentStatus"
              label="Employment Status"
              type="text"
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
            />
          </>
        )}
        {type === 'Guide' && (
          <>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {/* <TextField
              name="certificates"
              label=" (URL)"
              type="text"
              value={certificates}
              onChange={(e) => setCertificates(e.target.value)}
              required
            />
            <label>National ID</label>
            <FileUpload 
              onFileSelect={(file) => setNationalId(file)} 
              label="National ID" 
              inputId="national-id-upload" 
            />

            <label>Certificates</label>
            <FileUpload 
              onFileSelect={(file) => setCertificates(file)} 
              label="Certificates" 
              inputId="certificates-upload" 
            /> */}
            <TextField
              name="yearsOfExperience"
              label="Years of Experience"
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
            <TextField
              name="previousWork"
              label="Previous Work"
              type="text"
              value={previousWork}
              onChange={(e) => setPreviousWork(e.target.value)}
            />
          </>
        )}
        {type === 'Advertiser' && (
          <>
            <TextField
              name="websiteLink"
              label="Website Link"
              type="text"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            <TextField
              name="hotline"
              label="Hotline"
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
            />
            {/* <FileUpload 
              onFileSelect={(file) => setNationalId(file)} 
              label="National ID" 
              inputId="national-id-upload" 
            />
            <label>Taxation Registry Card</label>
            <FileUpload 
              onFileSelect={(file) => setTaxationRegisteryCard(file)} 
              label="Taxation Registry Card" 
              inputId="taxation-card-upload" 
            /> */}
            <TextField
              name="companyProfile"
              label="Company Profile"
              type="text"
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
            />
          </>
        )}
        {type === 'Seller' && (
          <>
            <TextField
              name="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            {/* <FileUpload 
              onFileSelect={(file) => setNationalId(file)} 
              label="National ID" 
              inputId="national-id-upload" 
            />
            <label>Taxation Registry Card</label>
            <FileUpload 
              onFileSelect={(file) => setTaxationRegisteryCard(file)} 
              label="Taxation Registry Card" 
              inputId="taxation-card-upload" 
            /> */}
             <TextField
              name="description"
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
        <DropDown />
        <Button
          variant="contained"
          onClick={handleAdd}
          style={{
            width: '580px',
            backgroundColor: 'Green',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            padding:'10px',
            justifyContent: 'center'
          }}
        >
          Sign Up
        </Button>
      </Stack>
    </div>
  );
};


export default FormSection;