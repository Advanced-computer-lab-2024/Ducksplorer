import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import GuestSidebar from '../../Components/Sidebars/GuestSidebar';
import { Outlet } from 'react-router-dom';

const GuestDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <GuestSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default GuestDashboard;