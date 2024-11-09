import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';
import { Outlet } from 'react-router-dom';
import TouristNavBar from '../../Components/TouristNavBar';
import Help from '../../Components/HelpIcon';

const TouristDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TouristNavBar/>
      <TouristSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Help />
    </Box>
  );
};

export default TouristDashboard;