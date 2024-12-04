import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
    navigate("/orders");
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
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
          width: sidebarStyle.width,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarStyle.width,
            boxSizing: "border-box",
            backgroundColor: sidebarStyle.backgroundColor,
          },
        }}
      >
        <div style={{ padding: "10px" }}>
          <Typography variant="h6" sx={{ paddingBottom: 2 }}>
            Actions
          </Typography>

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
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearchProduct}
            style={sidebarButtonStyle}
          >
            Search Products
          </Button>
          <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSortProducts}
          style={sidebarButtonStyle}
        >
          Sort Products
        </Button>
        {!isGuest && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleMyPurchases}
            style={sidebarButtonStyle}
          >
            My Orders
          </Button>
        )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={handleFilterClose}>Price</MenuItem>
          </Menu>
        </div>
      </Drawer>
      <Help />
    </div>
  );
};

export default TouristAllProducts;
