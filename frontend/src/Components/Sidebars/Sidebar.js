import React from "react";
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
//import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ReportIcon from "@mui/icons-material/Report"; // Icon for Complaints
import LockIcon from "@mui/icons-material/Lock"; // Icon for Change Password
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const drawerWidth = 300;

const Sidebar = () => {
  return (
    <Drawer
    variant="permanent"
    sx={{
      width: isSidebarOpen ? 300 : 80, // Sidebar width based on state
      transition: 'width 0.3s ease-in-out', // Smooth transition for opening/closing
      '& .MuiDrawer-paper': {
        width: isSidebarOpen ? 300 : 80, // Dynamic width for the drawer
        boxSizing: 'border-box',
        marginTop: '9vh', // Keep the sidebar below the app bar

        overflowX: 'hidden', // Prevent horizontal scrolling
        background: '#bce4e4', // Background color
        color: '#ffffff', // Text color
      },
    }}
    onMouseEnter={() => setIsSidebarOpen(true)} // Open sidebar on hover
    onMouseLeave={() => setIsSidebarOpen(false)} // Close sidebar on mouse leave
  >
    <div>
    
      <Divider sx={{ marginBottom: 2 }} />
      <List>
        {[
          { text: 'Change Password', icon: <LockIcon />, link: '/changePassword', color: '#00796b' },
          { text: 'Approve Pending Users', icon: <PeopleIcon />, link: '/pendingusers', color: '#388e3c' },
          { text: 'Delete Users', icon: <DeleteIcon />, link: '/deleteusers', color: '#d32f2f' },
          { text: 'Add Admin', icon: <PersonAddIcon />, link: '/addAdmin', color: '#1976d2' },
          { text: 'Add Governor', icon: <PersonAddIcon />, link: '/addGovernor', color: '#ffa000' },
          { text: 'Categories', icon: <CategoryIcon />, link: '/categoriesActions', color: '#8e24aa' },
          { text: 'Complaints', icon: <ReportIcon />, link: '/admin/complaints', color: '#c2185b' },
          { text: 'Tags', icon: <LabelIcon />, link: '/preferenceTags', color: '#3949ab' },
          { text: 'Products Management', icon: <ShoppingCartIcon />, link: '/Adminproducts', color: '#5d4037' },
          { text: 'View all Activities', icon: <WidgetsIcon />, link: '/ViewAllActivities', color: '#0097a7' },
          { text: 'View All Itineraries', icon: <EventNoteIcon />, link: '/ViewAllItineraries', color: '#f57c00' },
          { text: 'Revenue Report', icon: <EventNoteIcon />, link: '/adminReport', color: '#f57c00' },
          { text: 'Users Report', icon: <EventNoteIcon />, link: '/userReport', color: '#f57c00' },

        ].map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={index}
            sx={{
              padding: '10px 20px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center', // Center align icons when closed
              '&:hover': {
                backgroundColor: '#e0f7fa',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: item.color,
                justifyContent: 'center', // Center icons when sidebar is closed
              }}
            >
              <ListItemIcon
              sx={{
                color: item.color,
                justifyContent: 'center', // Center icons when sidebar is closed
              }}
            ></ListItemIcon>
              {item.icon}
              </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                opacity: isSidebarOpen ? 1 : 0, // Hide text when sidebar is closed
                whiteSpace: 'nowrap',
                transition: 'opacity 0.3s ease-in-out', // Smooth fade-in/out
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginTop: 2 }} />
    </div>
  </Drawer>
);
};

export default Sidebar;