import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TourGuideSidebar from '../../Components/Sidebars/TourGuideSidebar';

const TourGuideDashboard = () => {
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TourGuideSidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </div>
    );
}

export default TourGuideDashboard;