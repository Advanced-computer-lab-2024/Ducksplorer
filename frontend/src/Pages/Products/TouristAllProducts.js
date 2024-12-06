import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Drawer,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Grid,
} from "@mui/material";
import { message } from "antd";
import axios from "axios";
import ProductCard from "../../Components/Products/ProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { setMaxListeners } from "form-data";
import DuckLoading from "../../Components/Loading/duckLoading";

const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const TouristAllProducts = () => {
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("guest") === "true";

  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/adminRoutes/getproducts")
      .then((response) => {
        message.success("Products fetched successfully");
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        message.error("Failed to fetch products.");
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1000); // Delay of 1 second
      });
  }, []);

  const handleSearchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/sellerRoutes/findProduct",
        {
          params: { name },
        }
      );
      if (response.status === 200) {
        message.success("Products viewed successfully");
        setProducts(response.data);
      } else {
        message.error("Failed to search products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };
  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  const handleFilterProducts = async () => {
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
      } else {
        message.error("Failed to filter products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleSortProducts = async (order) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/sortProducts",
        {
          params: { sortingDecider: order },
        }
      );
      if (response.status === 200) {
        message.success("Products sorted successfully");
        setProducts(response.data);
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

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        paddingTop: "64px",
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Products
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Filter Section */}
          <TextField
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: 100 }}
          />
          <TextField
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: 100 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff9933",
              color: "white",
              textTransform: "capitalize",
            }}
            onClick={handleFilterProducts}
          >
            Filter
          </Button>
          {/* Search Section */}
          <TextField
            label="Search for a product"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff9933",
              color: "white",
              textTransform: "capitalize",
            }}
            onClick={handleSearchProducts}
          >
            Search
          </Button>

          {/* Sort Section */}
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                handleSortProducts(e.target.value);
              }}
              label="Sort By"
            >
              <MenuItem value="1">Price Ascending</MenuItem>
              <MenuItem value="0">Price Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3, gap: 2 }}>
          {!isGuest && (
            <>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "#ff9933",
                  paddingX: 4,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                onClick={() => navigate("/myCart")}
              >
                View Cart
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "#ff9933",
                  paddingX: 4,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                onClick={() => navigate("/Wishlist")}
              >
                View Wishlist
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "#ff9933",
                  paddingX: 4,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                onClick={() => navigate("/orders")}
              >
                View All Orders
              </Button>
            </>
          )}
        </Box> */}

        <Grid container spacing={3}>
          {products.filter((product) => product.isArchived !== true).length >
          0 ? (
            products
              .filter((product) => product.isArchived !== true)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard
                    product={product}
                    showRating={true}
                    showAddToCart={true}
                  />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No products found.
              </Typography>
            </Grid>
          )}
        </Grid>
        <Help />
      </Container>
    </Box>
  );
};

export default TouristAllProducts;
