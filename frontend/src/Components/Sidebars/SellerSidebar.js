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
import { Link } from 'react-router-dom';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleIcon from '@mui/icons-material/People';
// import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
// import CategoryIcon from '@mui/icons-material/Category';
// import LabelIcon from '@mui/icons-material/Label';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const drawerWidth = 300;

const SellerSidebar = () => {
  const [open, setOpen] = useState(false); // State for the dialog
  const [userName, setUserName] = useState('');

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
        const response = await axios.delete(`http://localhost:8000/sellerAccount/deleteMySellerAccount/${userName}`);
        alert(response.data.message); // Show success message
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
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <div>
        {/* <img src="logo1.png" style={{ width: '120px' , height: '120px' , padding: '10px', marginLeft: '50px'}} alt="logo" /> */}
        <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Seller Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem button onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete My Account" />
          </ListItem>

          <ListItem button component={Link} to="/sellerEditAccount">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </ListItem>

          <ListItem button component={Link} to="/ProductDashboard">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Products" />
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

export default SellerSidebar;