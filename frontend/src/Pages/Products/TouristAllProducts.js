import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Drawer,
  Stack,
} from "@mui/material";
import { message } from "antd";
import axios from "axios";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";

// Inline styles
// const pageStyle = {
//   backgroundColor: 'yellow',
//   minHeight: '100vh',
//   padding: '20px',
// };

const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const sidebarStyle = {
  width: 240,
  padding: "10px",
  backgroundColor: "lightblue", // Set the background color of the sidebar to be visible
};

const sidebarButtonStyle = {
  marginBottom: "10px",
  backgroundColor: "blue",
  color: "white", // White text for contrast
};

const TouristAllProducts = () => {
  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); 
  const isGuest = localStorage.getItem('guest') === 'true';

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    navigate("/FilterProducts");
  };

  const handleViewAllProducts = () => {
    navigate("/TouristProducts");
  };

  const handleSearchProduct = () => {
    navigate("/SearchProducts");
  };

  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const handleSearchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/sellerRoutes/findProduct",
        {
          params: {
            name, // Send price as a query parameter
          },
        }
      );

      if (response.status === 200) {
        message.success("Products viewed successfully");
        setProducts(response.data); // Store the filtered products
      } else {
        message.error("Failed to search products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleSortProducts = () => {
    navigate("/SortProducts");
  };

  const handleMyPurchases = () => {
    navigate("/myPurchases");
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <Box
    sx={{
      height: "100vh",
      backgroundColor: "#f9f9f9", // Light background for better contrast
      paddingTop: "64px", // Adjust for navbar height
    }}
  >
        <TouristNavBar />

    <div>
      {/* Search Container at the Top */}
      <Button onClick={handleBackButtonClick}>Back</Button>
      <div style={searchContainerStyle}>
        <Stack spacing={2}>
          <TextField
            label="Search for a product"
            variant="outlined"
            value={name}
              onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchProducts}
            style={{ backgroundColor: "#3f51b5", color: "white" }} // Blue color for better visibility
          >
            Search
          </Button>

          <div
            style={{
              maxHeight: "400px",
              overflowY: "visible",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            {/* Render the filtered products using the ProductCard component */}
            {products.filter((product) => product.isArchived !== true).length >
            0 ? (
              products
                .filter((product) => product.isArchived !== true)
                .map((product) => (
                  <div
                    key={product._id}
                    style={{ position: "relative", marginBottom: "20px" }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
            ) : (
              <Typography variant="body1" style={{ marginTop: "20px" }}>
                No products found.
              </Typography>
            )}
          </div>
        </Stack>
      </div>

      {/* Sidebar with Drawer */}
      <Drawer
  variant="permanent"
  sx={{
    width: 280, // Increased width for better spacing
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: 280,
      boxSizing: "border-box",
      backgroundColor: "#ffffff", // Clean white background
      boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      padding: "16px", // Padding inside the drawer
    },
  }}
>
  <Box>
    {/* Sidebar Title */}
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        marginBottom: 3,
        color: "#1a237e", // Dark blue for emphasis
        textAlign: "center", // Centered title
      }}
    >
      Actions
    </Typography>

    {/* Buttons */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Button
        fullWidth
        variant="contained"
        onClick={handleViewAllProducts}
        sx={{
          backgroundColor: "#1a237e",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        View All Products
      </Button>

      <Button
        fullWidth
        variant="contained"
        onClick={handleFilterClick}
        sx={{
          backgroundColor: "#1a237e",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        Filter Products
      </Button>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSearchProduct}
        sx={{
          backgroundColor: "#1a237e",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        Search Products
      </Button>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSortProducts}
        sx={{
          backgroundColor: "#1a237e",
          color: "white",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        Sort Products
      </Button>

      {!isGuest && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleMyPurchases}
          sx={{
            backgroundColor: "#1a237e",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 16px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
          }}
        >
          My Purchases
        </Button>
      )}
    </Box>

    {/* Filter Menu */}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleFilterClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <MenuItem onClick={handleFilterClose}>Price</MenuItem>
    </Menu>
  </Box>
</Drawer>

      <Help />
    </div>
  </Box>
  );
};

export default TouristAllProducts;
