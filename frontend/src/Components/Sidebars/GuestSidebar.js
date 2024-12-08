import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MuseumIcon from "@mui/icons-material/Museum";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
const drawerWidth = 300;
 
const GuestSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
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
      <div>
        <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Guest Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem
            button
            onClick={handleLoginClick}
            sx={{
              color: "error.main",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#ffe6e6",
                color: "error.dark",
              },
            }}
          >
            <ListItemText primary="Login or SignUp now" />
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
              <EventNoteIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="View All Itineraries" />}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/viewUpcomingItinerary"
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
              <EventAvailableIcon sx={{ color: "success.main" }} />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText primary="View Upcoming Itineraries" />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/TouristAllProducts"
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
              <ShoppingCartIcon sx={{ color: "info.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Products Actions" />}
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
              <MuseumIcon sx={{ color: "info.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="View Museums" />}
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
              padding: "8px 16px", // Better padding for touch interaction
            }}
          >
            <ListItemIcon>
              <MuseumIcon sx={{ color: "warning.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="View Historical Places" />}
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
              <EventAvailableIcon sx={{ color: "success.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="View Upcoming Museums" />}
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
              <EventAvailableIcon sx={{ color: "info.main" }} />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText primary="View Upcoming Historical Places" />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/activity/SortFilter"
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
              <WidgetsIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Upcoming Activities" />}
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
              <SearchIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Search Activities" />}
          </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default GuestSidebar;
