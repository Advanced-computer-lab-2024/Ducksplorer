
import React from "react";
import { Drawer } from "@mui/material";

const SidebarBase = ({ isSidebarOpen, setIsSidebarOpen, children }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarOpen ? 300 : 80,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          marginTop: "9vh",
          width: isSidebarOpen ? 300 : 80,
          boxSizing: "border-box",
          overflowX: "hidden",
          background: "#bce4e4",
          color: "#ffffff",
        },
      }}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      {children}
    </Drawer>
  );
};

export default SidebarBase;