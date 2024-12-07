import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
} from "@mui/material";
import { Button, Input } from "@mui/joy";
import { message } from "antd";
import axios from "axios";
import ProductCard from "../../Components/Products/ProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import NewProductCard from "../../Components/Products/newProductCard";
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
        width: "90vw",
      }}
    >
      <TouristNavBar />

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography fontWeight="700" class="bigTitle">
            Products
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Filter Section */}
          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <Button
            variant="contained"
            className="blackhover"
            onClick={handleFilterProducts}
            sx={{ color: "white" }}
          >
            Filter
          </Button>
          {/* Search Section */}
          <Input
            placeholder="Search for a product"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button
            variant="contained"
            className="blackhover"
            sx={{ color: "white" }}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px", // Adjust the gap between items as needed
            width: "100%",
            paddingBottom: 24,
          }}
        >
          {products.filter((product) => product.isArchived !== true).length >
          0 ? (
            products
              .filter((product) => product.isArchived !== true)
              .map((product) => <NewProductCard product={product}  showNotify={false} showAddToCart={true} hideWishlist={false} />)
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No products found.
            </Typography>
          )}
          <Help />
        </div>
      </Container>
    </Box>
  );
};

export default TouristAllProducts;
