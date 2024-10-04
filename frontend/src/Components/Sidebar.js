import React from 'react';
import { Drawer, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';


const drawerWidth = 300;

const Sidebar = () => {
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
          Admin Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
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
         <ListItem button component={Link} to="/preferenceTags">
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText primary="Tags" />
        </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default Sidebar;