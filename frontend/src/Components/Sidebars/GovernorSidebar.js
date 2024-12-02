import React, { useState } from 'react';
import { Drawer, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import MuseumIcon from '@mui/icons-material/Museum';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';

const GovernorSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
      
        width: isSidebarOpen ? 300 : 80,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          marginTop: "9vh",
          width: isSidebarOpen ? 300 : 76,
          boxSizing: "border-box",
          overflowX: "hidden",
          background: "#bce4e4",
          color: "#ffffff",
        },
      }}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      <Typography variant="h6" noWrap sx={{ padding: 2 }}>
        Tourism Governor Dashboard
      </Typography>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/changePassword"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            borderRadius: 1,
            margin: "4px 0",
            padding: "8px 16px",
          }}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Change Password" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/RUDMuseum"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            borderRadius: 1,
            margin: "4px 0",
            padding: "8px 16px",
          }}
        >
          <ListItemIcon>
            <MuseumIcon />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="View All My Museums" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/createMuseum"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            borderRadius: 1,
            margin: "4px 0",
            padding: "8px 16px",
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Create a new Museum" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/RUDHistoricalPlace"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            borderRadius: 1,
            margin: "4px 0",
            padding: "8px 16px",
          }}
        >
          <ListItemIcon>
            <MuseumIcon />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="View All My Historical Places" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/createHistoricalPlace"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            borderRadius: 1,
            margin: "4px 0",
            padding: "8px 16px",
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Create a new Historical Place" />}
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default GovernorSidebar;