import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { message } from 'antd';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../Components/TopNav/iconify.js';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Link } from 'react-router-dom';
 





function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
    try {
        setLoading(true);
        console.log(localStorage.getItem('user'));
        const response = await axios.post('http://localhost:8000/signUp/login', {
            userName,
            password,
        });
        if (response.status === 200) {
            message.success('Logged in successfully');
            if (response.data.role === 'Admin') {
                window.location.href = '/AdminDashboard';
            }
           localStorage.setItem('user', JSON.stringify(response.data));
        } else if (response.status === 400) {
            message.error('Failed to Login , Incorrect Username or Password');
            return;
        }
    } catch (error) {
        message.error('Failed to Login , Incorrect credentials');
    }
    finally{
        setLoading(false);
    }
};

  

  return (
   
   <>
      <div className="text-center">
          <img src="logo1.png" style={{ width: '300px' , height: '200px', justifyContent: 'center'}} alt="logo" />
          <h4 className="mt-1 mb-5 pb-1" style={{color: 'orange', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', textShadow: '2px 2px 4px #aaa'}}>
            Login
          </h4>     
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack spacing={3}>
          <TextField 
            name="username"
            label="Username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
      
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            value={password}
            height="50"
            width="20"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
            endAdornment:(
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)} edge="end"
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
          <p className="text-sm hover:undrline hover:text-blue-600 mt-2 inline-block">
            Dont have an account?
          </p>
          <Link to="/signUp" className='text-sm hover:undrline hover:text-blue-600 mt-2 inline-block'> 
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               Sign Up  
          </Link>


          <Button variant="contained" onClick={handleLogin} 
          style={{
            width: '300px', 
            backgroundColor: 'orange', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
            }} disabled={loading}>
             {loading? <span className='loading loading-spinner'></span> : 'Login'}
          </Button>
      </Stack>
      </div>
    </>


  );
}

export default Login;