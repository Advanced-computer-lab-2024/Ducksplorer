import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import ReportIcon from '@mui/icons-material/Report';
import LabelIcon from '@mui/icons-material/Label';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WidgetsIcon from '@mui/icons-material/Widgets';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WidgetsIcon from "@mui/icons-material/Widgets";
import ReportIcon from '@mui/icons-material/Report'; // Icon for Complaints
import LockIcon from '@mui/icons-material/Lock'; // Icon for Change Password
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const drawerWidth = 300;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <Drawer
    variant="permanent"
    sx={{
      width: isSidebarOpen ? 300 : 80, // Sidebar width based on state
      transition: 'width 0.3s ease-in-out', // Smooth transition for opening/closing
      '& .MuiDrawer-paper': {
        width: isSidebarOpen ? 300 : 80, // Dynamic width for the drawer
        boxSizing: 'border-box',
        marginTop: '5.2%', // Keep the sidebar below the app bar

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
          <ListItem button component={Link} to="/pendingusers">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Approve Pending Users" />
          </ListItem>
          <ListItem button component={Link} to="/deleteusers">
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete Users" />
          </ListItem>
          <ListItem button component={Link} to="/addAdmin">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Admin" />
          </ListItem>
          <ListItem button component={Link} to="/addGovernor">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Governor" />
          </ListItem>
          <ListItem button component={Link} to="/categoriesActions">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>

          {/* Complaints Button */}
          <ListItem button component={Link} to="/admin/complaints">
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Complaints" />
          </ListItem>

          <ListItem button component={Link} to="/preferenceTags">
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItem>
          <ListItem button component={Link} to="/Adminproducts">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products Management" />
          </ListItem>

          <ListItem button component={Link} to="/ViewAllActivities">
            <ListItemIcon>
              <WidgetsIcon />
            </ListItemIcon>
            <ListItemText primary="View all Activities " />
          </ListItem>

          <ListItem button component={Link} to="/ViewAllItineraries">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="View All Itineraries " />
          </ListItem>

          <ListItem button component={Link} to="/adminReport">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Revenue Report " />
          </ListItem>

          <ListItem button component={Link} to="/userReport">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Users Report " />
          </ListItem>

        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default Sidebar;
