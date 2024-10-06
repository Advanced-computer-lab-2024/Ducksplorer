import React from 'react';
import { Drawer, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleIcon from '@mui/icons-material/People';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
// import CategoryIcon from '@mui/icons-material/Category';
// import LabelIcon from '@mui/icons-material/Label';
import EventNoteIcon from '@mui/icons-material/EventNote';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import MuseumIcon from '@mui/icons-material/Museum';
// import PersonIcon from '@mui/icons-material/Person';
// import CasinoIcon from '@mui/icons-material/Casino';
import AddIcon from '@mui/icons-material/Add';

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
      {/* <img src="logo1.png" style={{ width: '120px' , height: '120px' , padding: '10px', marginLeft: '50px'}} alt="logo" /> */}
        <Typography variant="h6" noWrap sx={{ padding: 2 }}>
          Tour Guide Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem button component={Link} to="/rudItinerary">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="View All My Itineraries" />
          </ListItem>
          <ListItem button component={Link} to="/createItinerary">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create a new Itinerary" />
          </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default TouristSidebar;