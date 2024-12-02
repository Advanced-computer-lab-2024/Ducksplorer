import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography, Button, Box, Grid, Container } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { useNavigate } from "react-router-dom";

function MyPurchases() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const username = user.username;
    axios
      .get(`http://localhost:8000/touristRoutes/myPurchases/${username}`)
      .then((response) => {
        message.success("Purchases fetched successfully");
        setProducts(response.data[0].products);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
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
            My Purchases
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
          {products && products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard
                  product={product}
                  productID={product._id}
                  showRating={true}
                  showReview={true}
                  showAverageRatingNo={true}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No products found under the specified name.
              </Typography>
            </Grid>
          )}
        </Grid>
        <Help />
      </Container>
    </Box>
  );
}

export default MyPurchases;
