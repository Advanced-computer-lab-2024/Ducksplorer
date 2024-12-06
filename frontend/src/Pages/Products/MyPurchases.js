import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Typography, Button, Box, Grid, Container } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { useNavigate } from "react-router-dom";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]); // Use state for products
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
        const user = JSON.parse(userJson);
        const username = user.username;

        const response = await axios.get(
          `http://localhost:8000/touristRoutes/orderDetails/${orderNumber}`
        );
        message.success("Purchases fetched successfully");
        const fetchedPurchases = response.data.purchases;
        setPurchases(fetchedPurchases);

        // Fetch product details for each purchase
        for (const purchase of fetchedPurchases) {
          await fetchProductDetail(purchase.product);
        }
      } catch (error) {
        console.error("There was an error fetching the purchases!", error);
      }
    };

    fetchPurchases();
  }, [orderNumber]);

  const fetchProductDetail = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/getOrderProducts/${productId}`
      );
      const productDetail = response.data;
      console.log("Fetched product detail:", productDetail);

      setProducts((prevProducts) => {
        const isDuplicate = prevProducts.some(
          (product) => product._id === productDetail._id
        );
        return isDuplicate ? prevProducts : [...prevProducts, productDetail];
      });
      // Add the fetched product detail to the products state
      // setProducts((prevProducts) => [...prevProducts, productDetail]);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

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

        <h2>
          Order Number: {orderNumber}
        </h2>
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
            products.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id || index}>
                <ProductCard
                  product={item} // Pass the full product object
                  productID={item._id}
                  showAddToCart={false}
                  showReview={true}
                  showRating={true}
                  showAverageRating={true}
                  hideWishlist={true}
                  showPurchase={true}
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
