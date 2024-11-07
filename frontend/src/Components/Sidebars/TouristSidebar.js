import React from 'react';
import { Drawer, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MuseumIcon from '@mui/icons-material/Museum';
import PersonIcon from '@mui/icons-material/Person';
import WidgetsIcon from "@mui/icons-material/Widgets";
import SearchIcon from '@mui/icons-material/Search';
import ReportIcon from '@mui/icons-material/Report'; // Import icon for "My Complaints"

const drawerWidth = 300;

const TouristSidebar = () => {
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
    </Drawer>
  );
};

export default TouristSidebar;
