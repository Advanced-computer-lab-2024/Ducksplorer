import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { message } from "antd";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert"; // Ensure this is imported
import NewProductCard from "../../Components/Products/newProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import DuckLoading from "../../Components/Loading/duckLoading";

const TouristAllProducts = () => {
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("guest") === "true";
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Menu state for filter
  const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null); // Menu state for sorting

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/adminRoutes/getproducts")
      .then((response) => {
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]); // Set to an empty array if response is not an array
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        message.error("Failed to fetch products.");
        setProducts([]); // Fallback to empty array in case of error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/sellerRoutes/findProduct",
        {
          params: { name: searchQuery },
        }
      );
      if (response.status === 200) {
        message.success("Products searched successfully");
        setProducts(response.data);
      } else {
        message.error("Failed to search products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget); // Open the filter menu
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null); // Close the filter menu
  };

  const handleFilterProducts = async () => {
    if (!minPrice || !maxPrice || parseFloat(minPrice) > parseFloat(maxPrice)) {
      message.error("Please enter valid price ranges.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/filterProducts",
        {
          params: { minPrice, maxPrice },
        }
      );
      if (response.status === 200) {
        message.success("Products filtered successfully");
        setProducts(response.data);
        handleFilterClose(); // Close the filter menu after applying filter
      } else {
        message.error("Failed to filter products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleSortOrderClick = (event) => {
    setSortOrderAnchorEl(event.currentTarget); // Open the sort menu
  };

  const handleSortOrderClose = () => {
    setSortOrderAnchorEl(null); // Close the sort menu
  };

  const handleSortProducts = async (order) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/sortProducts",
        {
          params: { sortOrder: order }, // Pass 'asc' or 'desc' based on the selected option
        }
      );
      if (response.status === 200) {
        message.success("Products sorted successfully");
        setProducts(response.data.products); // Set the sorted products to the state
        handleSortOrderClose(); // Close the sort menu after sorting
      } else {
        message.error("Failed to sort products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "fff6e6",
        width: "100vw",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />

      <Container sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="bigTitle">Products</Typography>
        </Box>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 0.5fr auto auto",
            gap: "16px",
            paddingBottom: 24,
            width: "100%",
          }}
        >
          <Input
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="filled"
            color="primary"
          />

          <Button
            variant="solid"
            onClick={handleSearchProducts}
            className="blackhover"
            sx={{ backgroundColor: "#ff9933" }}
          >
            Search
          </Button>
          <Tooltip title="Filter Products">
            <IconButton onClick={handleFilterChoiceClick}>
              <FilterAltIcon sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Input
                  placeholder="Enter minimum price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  fullWidth
                  variant="filled"
                  color="primary"
                />
                <Input
                  placeholder="Enter maximum price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  fullWidth
                  variant="filled"
                  color="primary"
                />
                <Button
                  variant="contained"
                  onClick={handleFilterProducts}
                  className="blackhover"
                  sx={{ marginTop: "16px", backgroundColor: "#ff9933", color: 'white' }}
                >
                  Apply Filter
                </Button>
              </div>
            </MenuItem>
          </Menu>

          {/* Sort Section */}
          <Tooltip title="Sort by rating">
            <IconButton onClick={handleSortOrderClick}>
              <SwapVertIcon sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={sortOrderAnchorEl}
            open={Boolean(sortOrderAnchorEl)}
            onClose={handleSortOrderClose}
          >
            <MenuItem
              onClick={() => {
                setSortOrder("asc"); // Set the state for ascending order
                handleSortProducts("asc"); // Send the 'asc' query parameter to backend
                handleSortOrderClose(); // Close the sort menu
              }}
            >
              Ascending
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortOrder("desc"); // Set the state for descending order
                handleSortProducts("desc"); // Send the 'desc' query parameter to backend
                handleSortOrderClose(); // Close the sort menu
              }}
            >
              Descending
            </MenuItem>
          </Menu>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            width: "100%",
            paddingBottom: 24,
          }}
        >
          {products.filter((product) => !product.isArchived).length > 0 ? (
            products
              .filter((product) => !product.isArchived)
              .map((product) => (
                <NewProductCard
                  key={product._id}
                  product={product}
                  showAddToCart={true}
                  hideWishlist={false}
                />
              ))
          ) : (
            <Typography variant="h6" color="text.secondary">
              No products available.
            </Typography>
          )}
        </div>
      </Container>
    </Box>
  );
};

export default TouristAllProducts;
