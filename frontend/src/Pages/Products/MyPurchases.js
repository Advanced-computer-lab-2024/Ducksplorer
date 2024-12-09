import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Typography, Button, Box, Grid, Container } from "@mui/material";
import NewProductCard from "../../Components/Products/newProductCard";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { useNavigate } from "react-router-dom";
import NavigationTabs from "../../Components/NavigationTabs";
function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]); // Use state for products
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const tabs = ["My Orders"];
  const paths = ["/orders"];
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/orderDetails/${orderNumber}`
        );
        const fetchedPurchases = response.data.purchases;
  
        // Store purchases with chosenQuantity
        setPurchases(fetchedPurchases);
  
        // Fetch product details for each purchase and include chosenQuantity
        const productDetails = await Promise.all(
          fetchedPurchases.map(async (purchase) => {
            const productResponse = await axios.get(
              `http://localhost:8000/touristRoutes/getOrderProducts/${purchase.product}`
            );
            return { ...productResponse.data, chosenQuantity: purchase.chosenQuantity };
          })
        );
  
        setProducts(productDetails); // Store products with chosenQuantity
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
        paddingTop: "64px",
      }}
    >
      <TouristNavBar />
      <Button
        className="blackhover"
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
      <div>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography className="bigTitle" variant="h4" fontWeight="700">
          Order Number: {orderNumber}
          </Typography>
        </Box>
        {/* <div>
          <NavigationTabs tabNames={tabs} paths={paths} />
        </div> */}
        <h2>
          
        </h2>
        <Grid container spacing={products && products.length > 1 && products.length < 3 ? 23 : 4}>
          {products && products.length > 0 ? (
            products.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id || index}>
                <NewProductCard
                  product={item} // Pass the full product object
                  productID={item._id}
                  showAddToCart={false}
                  showReview={true}
                  showRating={true}
                  showAverageRating={true}
                  hideWishlist={true}
                  showPurchase={true}
                  showChosenQuantity={true}
                  chosenQuantity={item.chosenQuantity}
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
        </div>
    </Box>
  );
}

export default MyPurchases;