import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { message } from 'antd';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from "../../Components/TopNav/iconify.js";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Sidebar from '../../Components/Sidebars/Sidebar';


function ChangePassword() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for password visibility
  const role = JSON.parse(localStorage.getItem('user')).role;

const validatePassword = () => {
    if(!password || !newPassword) {
        message.error('Please fill all fields');
        return false;
    }
    return true;
  };

  const changePassword = async () => {
    try {
        if(!validatePassword()) return;
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



  return (
    <>
    <Sidebar />
       <div className="text-center">
        <img
          src="logo3.png"
          style={{ width: "300px", height: "200px", justifyContent: "center" }}
          alt="logo"
        />
        <h4
          className="mt-1 mb-5 pb-1"
          style={{
            color: "orange",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #aaa",
            marginBottom: "20px",
          }}
        >
          {role}  Change Password
        </h4>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: "center", verticalAlign: "middle" }}>
        <Stack spacing={3}>
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
    </>
  );
}

export default ChangePassword;