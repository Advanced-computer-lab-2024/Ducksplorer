import React, { useState } from "react";
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
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MuseumIcon from "@mui/icons-material/Museum";
import PersonIcon from "@mui/icons-material/Person";
import WidgetsIcon from "@mui/icons-material/Widgets";
// import SearchIcon from '@mui/icons-material/Search';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"; // Import the new icon
import DeleteIcon from "@mui/icons-material/Delete";
import BookIcon from "@mui/icons-material/Book"; // Import an icon for "My Past Bookings"
import axios from "axios";
import ReportIcon from "@mui/icons-material/Report"; // Import icon for "My Complaints"
import { Box } from "@mui/material";

const TouristSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const [open, setOpen] = useState(false); // State for the dialog
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDeleteClick = () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    setUserName(user?.username || "");
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleDeleteAccount = async () => {
    if (userName) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/touristAccount/deleteMyTouristAccount/${userName}`
        );
        alert(response.data.message); // Show success message
        navigate("/login"); // Redirect to the login page
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
          width: isSidebarOpen ? 300 : 80,
          boxSizing: "border-box",
          overflowX: "hidden", // Prevent horizontal scrolling
          background: "linear-gradient(180deg, #1a237e, #0d47a1)", // Gradient background
          color: "#ffffff", // White text for contrast
        },
      }}
    >
      <div>
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
            <ListItemText
              primary="Delete My Account"
              sx={{
                fontWeight: "bold",
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/editAccount"
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
            <ListItemText
              primary="Profile"
              sx={{
                fontWeight: "500", // Slightly bold for emphasis
                color: "text.primary", // Theme-based text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/viewAllTourist"
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
            <ListItemText
              primary="View All Itineraries"
              sx={{
                fontWeight: "500", // Slight emphasis on text
                color: "text.primary", // Ensure consistent theme color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/viewUpcomingItinerary"
            sx={{
              "&:hover": {
                backgroundColor: "#f0f8ff", // Light blue hover effect
              },
              borderRadius: 1, // Rounded corners
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Improve padding for touch-friendly interaction
            }}
          >
            <ListItemIcon>
              <EventAvailableIcon sx={{ color: "success.main" }} />{" "}
              {/* Theme-based success color */}
            </ListItemIcon>
            <ListItemText
              primary="View Upcoming Itineraries"
              sx={{
                fontWeight: "500", // Slightly bold text
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/TouristAllProducts"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover effect
              },
              borderRadius: 1, // Rounded corners
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Improve touch-friendly interaction
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon sx={{ color: "secondary.main" }} />{" "}
              {/* Secondary color for the icon */}
            </ListItemIcon>
            <ListItemText
              primary="Products Actions"
              sx={{
                fontWeight: "500", // Slightly bold text
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/MuseumTouristPov"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover background
              },
              borderRadius: 1, // Rounded corners
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Better padding for touch interaction
            }}
          >
            <ListItemIcon>
              <MuseumIcon sx={{ color: "info.main" }} />{" "}
              {/* Info color for icon */}
            </ListItemIcon>
            <ListItemText
              primary="View Museums"
              sx={{
                fontWeight: "500", // Slightly bold text
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/HistoricalPlaceTouristPov"
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
              <MuseumIcon sx={{ color: "warning.main" }} />{" "}
              {/* Use warning color for variety */}
            </ListItemIcon>
            <ListItemText
              primary="View Historical Places"
              sx={{
                fontWeight: "500", // Slightly bold text
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/UpcomingMuseums"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover background
              },
              borderRadius: 1, // Rounded corners
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Better padding for touch interaction
            }}
          >
            <ListItemIcon>
              <EventAvailableIcon sx={{ color: "success.main" }} />{" "}
              {/* Green color for upcoming events */}
            </ListItemIcon>
            <ListItemText
              primary="View Upcoming Museums"
              sx={{
                fontWeight: "500", // Slightly bold text
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/UpcomingHistoricalPlaces"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover effect
              },
              borderRadius: 1, // Smooth rounded corners
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Improve padding for touch interaction
            }}
          >
            <ListItemIcon>
              <EventAvailableIcon sx={{ color: "info.main" }} />{" "}
              {/* Blue color for upcoming historical events */}
            </ListItemIcon>
            <ListItemText
              primary="View Upcoming Historical Places"
              sx={{
                fontWeight: "500", // Slightly bold text for emphasis
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/activity/searchActivities"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover effect
              },
              borderRadius: 1, // Smooth rounded corners
              margin: "4px 0", // Spacing between items
              padding: "8px 16px", // Improved padding for touch-friendly interaction
            }}
          >
            <ListItemIcon>
              <DirectionsRunIcon sx={{ color: "success.main" }} />{" "}
              {/* Green for activities */}
            </ListItemIcon>
            <ListItemText
              primary="View All Activities"
              sx={{
                fontWeight: "500", // Slightly bold text for emphasis
                color: "text.primary", // Theme-based text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/activity/sortFilter"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Light hover background
              },
              borderRadius: 1, // Smooth rounded corners
              margin: "4px 0", // Spacing between items
              padding: "8px 16px", // Improved padding for better interaction
            }}
          >
            <ListItemIcon>
              <WidgetsIcon sx={{ color: "info.main" }} />{" "}
              {/* Blue for upcoming activities */}
            </ListItemIcon>
            <ListItemText
              primary="View Upcoming Activities"
              sx={{
                fontWeight: "500", // Slightly bold text for emphasis
                color: "text.primary", // Consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/myPastBookings"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Subtle hover effect
              },
              borderRadius: 1, // Rounded corners for a cleaner look
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Better padding for user interaction
            }}
          >
            <ListItemIcon>
              <BookIcon sx={{ color: "secondary.main" }} />{" "}
              {/* Use secondary color for bookings */}
            </ListItemIcon>
            <ListItemText
              primary="My Past Bookings"
              sx={{
                fontWeight: "500", // Slightly bold text for emphasis
                color: "text.primary", // Theme-consistent text color
              }}
            />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/myComplaints"
            sx={{
              "&:hover": {
                backgroundColor: "#f9f9f9", // Subtle hover effect
              },
              borderRadius: 1, // Rounded corners for better appearance
              margin: "4px 0", // Add spacing between items
              padding: "8px 16px", // Improved padding for user interaction
            }}
          >
            <ListItemIcon>
              <ReportIcon sx={{ color: "error.main" }} />{" "}
              {/* Red color to indicate complaints */}
            </ListItemIcon>
            <ListItemText
              primary="My Complaints"
              sx={{
                fontWeight: "500", // Slightly bold text for emphasis
                color: "text.primary", // Consistent text color with the theme
              }}
            />
          </ListItem>
        </List>
        <Divider />
      </div>

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

export default TouristSidebar;
