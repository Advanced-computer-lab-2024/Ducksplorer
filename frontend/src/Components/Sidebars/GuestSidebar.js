import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MuseumIcon from '@mui/icons-material/Museum';
import WidgetsIcon from "@mui/icons-material/Widgets";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 300;

const GuestSidebar = () => {
  const [open, setOpen] = useState(false); // State for the dialog
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
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
          Guest Dashboard
        </Typography>
        <Divider />
        <List>

          <ListItem
            button
            onClick={handleLoginClick}
            sx={{ color: 'red', cursor: 'pointer' }}
          >
            <ListItemText primary="Login or SignUp now" />
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

          <ListItem button component={Link} to="/UpcomingMuseums">
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="View Upcoming Museums" />
          </ListItem>

          <ListItem button component={Link} to="/UpcomingHistoricalPlaces">
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="View Upcoming Historical Places" />
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

        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default GuestSidebar;