import React, { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';
import { Outlet } from 'react-router-dom';
import TouristNavBar from '../../Components/TouristNavBar';
import Help from '../../Components/HelpIcon';

const TouristDashboard = () => {
  // Use effect to set the body background
  useEffect(() => {
    document.body.style.backgroundImage = 'url("/duckkbg.jpg")';  // Path to your image
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';  // Keeps the background fixed
    document.body.style.margin = 0;  // Remove any margin on body
    document.body.style.height = '100vh'; // Ensures body covers full viewport height

    return () => {
      // Cleanup the background style when component is unmounted
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TouristNavBar />
      <TouristSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Help />
    </Box>
  );
};

export default TouristDashboard;
