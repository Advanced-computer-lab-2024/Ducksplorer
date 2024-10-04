import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem, TextField, Typography, Drawer } from '@mui/material';
import AllProducts from '../Pages/AllProducts';

// Inline styles
const pageStyle = {
  backgroundColor: 'yellow',
  minHeight: '100vh',
  padding: '20px',
};

const searchContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
};

const sidebarStyle = {
  width: 240,
  padding: '10px',
  backgroundColor: 'lightblue', // Set the background color of the sidebar to be visible
};

const sidebarButtonStyle = {
  marginBottom: '10px',
  backgroundColor: '#ff9800',  // Orange color for better visibility
  color: 'white',  // White text for contrast
};

const ProductActions = () => {
  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); 

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Placeholder functions for button actions
  const handleAddProduct = () => {
    navigate('/AddProducts');
  };

  const handleViewAllProducts = () => {
    navigate('/AllProducts');
  };

  const handleSearchProduct = () => {
    alert(`Search for: ${searchQuery}`);
  };

  return (
    <div style={pageStyle}>
      {/* Search Container at the Top */}
      <div style={searchContainerStyle}>
        <TextField
          label="Search for a product"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchProduct}
          style={{ backgroundColor: '#3f51b5', color: 'white' }}  // Blue color for better visibility
        >
          Search
        </Button>
      </div>

      {/* Sidebar with Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarStyle.width,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarStyle.width,
            boxSizing: 'border-box',
            backgroundColor: sidebarStyle.backgroundColor,
          },
        }}
      >
        <div style={{ padding: '10px' }}>
          <Typography variant="h6" sx={{ paddingBottom: 2 }}>
            Actions
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddProduct}
            style={sidebarButtonStyle}
          >
            Add Product
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleViewAllProducts}
            style={sidebarButtonStyle}
          >
            View All Products
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleFilterClick}
            style={sidebarButtonStyle}
          >
            Filter Products
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={handleFilterClose}>Price</MenuItem>
          </Menu>
        </div>
      </Drawer>
    </div>
  );
};

export default ProductActions;
