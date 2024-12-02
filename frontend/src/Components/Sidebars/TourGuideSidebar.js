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
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Box } from '@mui/material';

const TourGuideSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const [open, setOpen] = useState(false); // State for the dialog
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDeleteClick = () => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    setUserName(user?.username || '');
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleDeleteAccount = async () => {
    if (userName) {
      try {
        const response = await axios.delete(`http://localhost:8000/tourGuideAccount/deleteMyTourGuideAccount/${userName}`);
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
        width: isSidebarOpen ? 300 : 80, // Sidebar width based on state
        transition: "width 0.3s ease-in-out", // Smooth transition
        "& .MuiDrawer-paper": {
          marginTop: "9vh", // Keep the sidebar below the app bar
          width: isSidebarOpen ? 300 : 76,
          boxSizing: "border-box",
          overflowX: "hidden", // Prevent horizontal scrolling
          background: "#bce4e4", // Gradient background
          color: "#ffffff", // White text for contrast
        },
      }}
      onMouseEnter={() => setIsSidebarOpen(true)} // Open sidebar on hover
      onMouseLeave={() => setIsSidebarOpen(false)} // Close sidebar on mouse leave
    >
      <List>
        <ListItem
          button
          onClick={handleDeleteClick}
          sx={{
            color: "error.main",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#ffe6e6",
              color: "error.dark",
            },
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: "error.main" }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Delete My Account" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/tourGuideEditAccount"
          sx={{
            "&:hover": {
              backgroundColor: "#f0f8ff", // Light blue hover background
            },
            borderRadius: 1, // Slightly round edges for better aesthetics
            margin: "4px 0", // Add some spacing between list items
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: "primary.main" }} />{" "}
            {/* Styled with theme color */}
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Edit Profile" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/rudItinerary"
          sx={{
            "&:hover": {
              backgroundColor: "#f0f8ff", // Light blue hover effect
            },
            borderRadius: 1, // Rounded corners for better aesthetics
            margin: "4px 0", // Add spacing between items
            padding: "8px 16px", // Better padding for touch interaction
          }}
        >
          <ListItemIcon>
            <EventNoteIcon sx={{ color: "primary.main" }} />{" "}
            {/* Theme-based color */}
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="View All My Itineraries" />}
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/createItinerary"
          sx={{
            "&:hover": {
              backgroundColor: "#f9f9f9", // Light hover background
            },
            borderRadius: 1, // Rounded corners
            margin: "4px 0", // Add spacing between items
            padding: "8px 16px", // Improve touch-friendly interaction
          }}
        >
          <ListItemIcon>
            <AddIcon sx={{ color: "warning.main" }} />{" "}
            {/* Use warning color for variety */}
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Create a new Itinerary" />}
        </ListItem>
      </List>
      <Divider />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" // Keeps the width manageable; adjust if needed
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2, // Rounded corners
            padding: 2, // Padding inside the dialog
            boxShadow: 3, // Subtle shadow for better aesthetics
            height: "300px", // Increased height for more space
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #e0e0e0", // Subtle separator
            paddingBottom: 2,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            color: "text.secondary", // Theme-based secondary text color
            padding: "24px", // Spacing inside the content
            display: "flex",
            flexDirection: "column", // Align content vertically
            justifyContent: "center", // Center vertically
            height: "100%", // Utilize full height
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            Are you sure you want to delete your account?
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "error.main", fontWeight: "bold" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center", // Center buttons
            padding: "8px 24px", // Spacing around buttons
          }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: "bold",
              padding: "8px 16px", // Add padding for better appearance
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            sx={{
              color: "white",
              backgroundColor: "error.main",
              fontWeight: "bold",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default TourGuideSidebar;