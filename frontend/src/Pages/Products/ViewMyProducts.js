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
import AddIconCard from "../../Components/AddIconCard";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { message } from "antd";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert"; // Ensure this is imported
import NewProductCard from "../../Components/Products/newProductCard";
import Help from "../../Components/HelpIcon";
import SellerNavBar from "../../Components/NavBars/SellerNavBar";
import DuckLoading from "../../Components/Loading/duckLoading";
import NavigationTabs from "../../Components/NavigationTabs";

const ProductDashboard = () => {
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

  const tabs=["All Products","My Products"];
  const paths=["/ProductDashboard","/ViewMyProducts"]

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const seller = user.username;
    axios
      .get(`http://localhost:8000/sellerRoutes/ViewMyProducts/${seller}`)
      .then((response) => {
        message.success("Products fetched successfully");
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
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

  const handleViewMyProducts = () => {
    navigate("/ViewMyProducts");
  };
  const handleAddProduct = () => {
    navigate("/AddProducts");
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
      <SellerNavBar />

      <Container sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="bigTitle">Products</Typography>
          <div>
                <NavigationTabs tabNames={tabs} paths={paths} />
          </div>
        </Box>

        

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            width: "100%",
            paddingBottom: 24,
          }}
        >
          <AddIconCard/>
          {products.filter((product) => !product.isArchived).length > 0 ? (
            products
              .filter((product) => !product.isArchived)
              .map((product) => (
                <NewProductCard
                  key={product._id}
                  product={product}
                  showAddToCart={false}
                  hideWishlist={true}
                  showEditProduct={true}
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

export default ProductDashboard;
