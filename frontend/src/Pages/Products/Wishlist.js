import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import { Button, Box } from "@mui/material";
import { Container } from "@mui/material";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";
import DuckLoading from "../../Components/Loading/duckLoading";
import Error404 from "../../Components/Error404.js";
import NewProductCard from "../../Components/Products/newProductCard";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
  const user = JSON.parse(userJson);
  const userName = user.username;
  setLoading(true);
  axios
    .get(`http://localhost:8000/touristRoutes/myWishlist/${userName}`)

    .then((response) => {
      message.success("wishlist fetched successfully");
      setProducts(response.data[0].products);
      console.log("these are the products", response.data[0].products);
    })
    .catch((error) => {
      console.error("There was an error fetching the wishlist!", error);
    })
    .finally(() => {
      setTimeout(() => setLoading(false), 1000); // Delay of 1 second
    });
}, []);
  const handleBackButtonClick = () => {
    window.history.back();
  };

  const removeProductFromWishlist = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
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
        width: "90vw",
      }}
    >
      <TouristNavBar />

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography fontWeight="700" class="bigTitle">
            My Wishlist
          </Typography>
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
          {/* Render the filtered products using the ProductCard component */}
          {products && products.length > 0 ? (
            products.map((product) => 
              <NewProductCard
                key={product._id}
                product={product}
                productID={product._id}
                showRating={true}
                showAverageRatingNo={true}
                showRemoveWishlist={true}
                removeProductFromWishlist={removeProductFromWishlist}
                showAddToCart={true}
              />)
          ) : (
            <div>
              <Error404 />
            </div>
          )}
        </div>
        <Help />
      </Container>
    </Box>
  );
}

export default Wishlist;

/*            
        {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                style={{ position: "relative", marginBottom: "20px" }}
              >
                <ProductCard
                  key={product._id}
                  product={product}
                  productID={product._id}
                  showRating={true}
                  showAverageRatingNo={true}
                  showRemoveWishlist={true}
                  removeProductFromWishlist={removeProductFromWishlist}
                  showAddToCart={true}
                />
              </div>
            ))
          ) : (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              No products found in your wishlist.
            </Typography>
          )}
                */
