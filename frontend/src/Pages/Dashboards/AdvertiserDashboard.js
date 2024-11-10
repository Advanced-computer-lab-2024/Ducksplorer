import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar";
import React from "react";
import { Box, CssBaseline } from "@mui/material";

function AdvertiserDashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdvertiserSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}

export default AdvertiserDashboard;
