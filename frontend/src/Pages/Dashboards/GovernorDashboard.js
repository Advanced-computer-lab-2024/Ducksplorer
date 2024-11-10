import React from "react";
import { Box, CssBaseline } from "@mui/material";
import GovernorSidebar from "../../Components/Sidebars/GovernorSidebar";
import { Outlet } from "react-router-dom";
import Help from "../../Components/HelpIcon";

const GovernorDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <GovernorSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Help />
    </Box>
  );
};

export default GovernorDashboard;
