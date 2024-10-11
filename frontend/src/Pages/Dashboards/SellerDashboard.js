import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import SellerSidebar from '../../Components/Sidebars/SellerSidebar';
import { Outlet } from 'react-router-dom';

const SellerDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SellerSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SellerDashboard;