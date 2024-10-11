import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';
import { Outlet } from 'react-router-dom';

const TouristDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TouristSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default TouristDashboard;