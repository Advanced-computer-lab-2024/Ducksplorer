import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../../Components/Sidebars/Sidebar";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../Components/TopNav/Adminnavbar";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <AdminNavbar/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
