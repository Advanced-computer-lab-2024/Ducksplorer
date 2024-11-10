import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../../Components/Sidebars/Sidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
