import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { message } from 'antd';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from "../../Components/TopNav/iconify.js";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import AdminNavBar from '../../Components/NavBars/AdminNavBar.js';
import { Box, Grid, Typography } from '@mui/material';
import GovernorNavBar from '../../Components/NavBars/GovernorNavBar.js';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for password visibility
  const role = JSON.parse(localStorage.getItem('user')).role;
  const navigate = useNavigate();

  const validatePassword = () => {
    if(!password || !newPassword) {
        message.error('Please fill all fields');
        return false;
    }
    return true;
  };

  const changePassword = async () => {
    try {
      if (!validatePassword()) return;
      const response = await axios.post("http://localhost:8000/admin/changePassword", {
        userName: JSON.parse(localStorage.getItem('user')).username,
        password: password,
        newPassword: newPassword
      }
      );
      console.log(response);
      if (response.status === 200) {
        message.success('Password changed successfully');
        window.location.href = "/login"; // Replace with your URL
      }
      else
        throw new Error(response.error);
    } catch (error) {
      message.error(error.response.data.error);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      changePassword();
    }
  }

  return (
    <>
      {role==="Admin" && <AdminNavBar />}
      {role==="Governor" && <GovernorNavBar/>}
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" className="duckTitle" style={styles.welcomeText}>
            {role} Change Password
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Box
            sx={{
              width: "100%", // Responsive width
              height: "100%", // Take full height
              backgroundColor: "#f9f9f9", // Same as the page background
              borderRadius: "16px", // Rounded corners
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow
              textAlign: "center",
              display: "flex", // Flexbox for centering
              flexDirection: "column", // Column direction
              justifyContent: "center", // Center vertically
              alignItems: "center", // Center horizontally
            }}
          >
            {/* Title Section */}
            <h2 className="bigTitle" style={{ textAlign: "center", alignSelf: "center" , marginTop:"-20vh"}}>
              Change Password
            </h2>

            {/* Logo Section */}
            <Box sx={{ marginBottom: "24px" }}>
              <img
                src="logo1.png"
                alt="Logo"
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  justifySelf: "center",
                  width: "150px",
                  height: "auto",
                  marginTop: "5vh",
                  marginBottom: "5vh",
                }}
              />
            </Box>

            {/* Form Section */}
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <Stack spacing={3} onKeyPress={handleKeyPress} style={{ justifyContent: "center", alignContent: "center" }}>
                <TextField
                  name="Old Password"
                  label="Old Password"
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility
                  value={password}
                  height="50"
                  width="20"
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)} edge="end"
                        >
                          <Iconify
                            icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                            style={{ color: 'orange', fontSize: '40px' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="New Password"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'} // Toggle password visibility
                  value={newPassword}
                  height="50"
                  width="20"
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)} edge="end"
                        >
                          <Iconify
                            icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                            style={{ color: 'orange', fontSize: '40px' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button variant="contained" onClick={changePassword}
                  style={{
                    width: '300px',
                    color: 'white',
                    backgroundColor: 'orange',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}>
                  Change Password
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "120vh",
    width: "100vw",
    background: 'url("/duckPassword.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
    overflowY: "visible",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default ChangePassword;