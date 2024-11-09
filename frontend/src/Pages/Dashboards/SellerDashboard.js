import React from "react";
import { Box, CssBaseline } from "@mui/material";
import SellerSidebar from "../../Components/Sidebars/SellerSidebar";
import { Outlet } from "react-router-dom";
import Help from "../../Components/HelpIcon";

const SellerDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SellerSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Help />
    </Box>
  );
};

export default SellerDashboard;
