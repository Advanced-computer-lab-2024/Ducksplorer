import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Menu,
  Checkbox,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Rating,
} from "@mui/material";
function TouristProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/adminRoutes/getproducts")
      .then((response) => {
        message.success("Products fetched successfully");
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        message.error("Failed to fetch products.");
      });
  }, []);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f9f9f9",
        paddingTop: "64px", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <Box
        sx={{
          padding: "20px",
          margin: "auto",
          maxWidth: "1200px",
          height: "100%",
        }}
      >
        {/* Back Button */}
        <Button
          onClick={handleBackButtonClick}
          variant="contained"
          sx={{
            backgroundColor: "#1a237e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            marginBottom: "20px",
            "&:hover": {
              backgroundColor: "#0d47a1",
            },
          }}
        >
          Back
        </Button>

        {/* Product Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)", // Single column for small screens
              sm: "repeat(2, 1fr)", // Two columns for medium screens
              md: "repeat(3, 1fr)", // Three columns for large screens
            },
            gap: "24px",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {products.filter((product) => product.isArchived !== true).length >
          0 ? (
            products
              .filter((product) => product.isArchived !== true)
              .map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showRating={false}
                  showPurchase={true}
                />
              ))
          ) : (
            <Typography
              variant="body1"
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              No products found under the specified name.
            </Typography>
          )}
        </Box>
        <Help />
      </Box>
    </Box>
  );
}

export default TouristProducts;
