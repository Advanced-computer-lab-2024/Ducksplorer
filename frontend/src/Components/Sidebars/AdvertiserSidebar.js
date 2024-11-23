import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
// import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
// import WidgetsIcon from "@mui/icons-material/Widgets";
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
const drawerWidth = 300;

const AdvertiserSidebar = () => {
  const [open, setOpen] = useState(false); // State for the dialog
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDeleteClick = () => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    setUserName(user.username);
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleDeleteAccount = async () => {
    if (userName) {
      try {
        const response = await axios.delete(`http://localhost:8000/advertiserAccount/deleteMyAdvertiserAccount/${userName}`);
        alert(response.data.message); // Show success message
        navigate('/login'); // Redirect to the login page
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
    handleClose(); // Close the dialog after deletion
  };


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <div>
        {/* <img src="logo1.png" style={{ width: '120px' , height: '120px' , padding: '10px', marginLeft: '50px'}} alt="logo" /> */}
        <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Advertiser Dashboard
        </Typography>
        <Divider />
        <List>
          {/* <ListItem component={Link} to="/advertiserDashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem> */}

          <ListItem
            button
            onClick={handleDeleteClick}
            sx={{ color: 'red', cursor: 'pointer' }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete My Account" />
          </ListItem>

          <ListItem component={Link} to="/advertiserEditAccount">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Account" />
          </ListItem>

          <ListItem component={Link} to="/activity/addActivity">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Activity" />
          </ListItem>

          <ListItem component={Link} to="/activity/myActivities">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="My Activities" />
          </ListItem>

          <ListItem component={Link} to="/advertiserReport">
            <ListItemIcon>
              <SummarizeIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Report" />
          </ListItem>

        </List>
        <Divider />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            sx={{ color: 'white', backgroundColor: 'error.main' }} // Set red background
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Drawer>
  );
};

export default AdvertiserSidebar;
