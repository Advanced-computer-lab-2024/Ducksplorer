import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography, Button, Box, Grid, Container } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { useNavigate } from "react-router-dom";

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
        backgroundColor: "#ffffff",
        paddingTop: "64px",
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Available Products
          </Typography>
        </Box>

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
}

export default TouristProducts;
