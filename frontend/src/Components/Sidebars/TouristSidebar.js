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
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MuseumIcon from '@mui/icons-material/Museum';
import PersonIcon from '@mui/icons-material/Person';
import WidgetsIcon from "@mui/icons-material/Widgets";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book'; // Import an icon for "My Past Bookings"
import axios from 'axios';import ReportIcon from '@mui/icons-material/Report'; // Import icon for "My Complaints"

const drawerWidth = 300;

const TouristSidebar = () => {
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
        const response = await axios.delete(`http://localhost:8000/touristAccount/deleteMyTouristAccount/${userName}`);
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
        <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Tourist Dashboard
        </Typography>
        <Divider />
        <List>

          <ListItem
            button
            onClick={handleDeleteClick}
            sx={{ color: 'red', cursor: 'pointer' }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: 'red' }} />
            </ListItemIcon>
            <ListItemText primary="Delete My Account" />
          </ListItem>

          <ListItem button component={Link} to="/editAccount">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem button component={Link} to="/viewAllTourist">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="View All Itineraries" />
          </ListItem>

          <ListItem button component={Link} to="/viewUpcomingItinerary">
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="View Upcoming Itineraries" />
          </ListItem>

          <ListItem button component={Link} to="/TouristAllProducts">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products Actions" />
          </ListItem>

          <ListItem button component={Link} to="/MuseumTouristPov">
            <ListItemIcon>
              <MuseumIcon />
            </ListItemIcon>
            <ListItemText primary="View Museums" />
          </ListItem>

          <ListItem button component={Link} to="/HistoricalPlaceTouristPov">
            <ListItemIcon>
              <MuseumIcon />
            </ListItemIcon>
            <ListItemText primary="View Historical Places" />
          </ListItem>

          <ListItem button component={Link} to="/activity/sortFilter">
            <ListItemIcon>
              <WidgetsIcon />
            </ListItemIcon>
            <ListItemText primary="Upcoming Activities" />
          </ListItem>

          <ListItem button component={Link} to="/activity/searchActivities">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search Activities" />
          </ListItem>

          <ListItem button component={Link} to="/myPastBookings">
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="My Past Bookings" />
          </ListItem>
          {/* New My Complaints button */}
          <ListItem button component={Link} to="/myComplaints">
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="My Complaints" />
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

export default TouristSidebar;
