import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import { Button, Box } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";
import DuckLoading from "../../Components/Loading/duckLoading";
import Error404 from "../../Components/Error404.js";

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
    <>
      <TouristNavBar />
      <Button onClick={handleBackButtonClick}>Back</Button>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="700">
          My Wishlist
        </Typography>
      </Box>
      <div
        style={{
          padding: "20px",
          margin: "auto",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            overflowY: "visible",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {/* Render the filtered products using the ProductCard component */}
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
            <div>
              <Error404 />
            </div>
          )}
        </div>
        <Help />
      </div>
    </>
  );
}

export default Wishlist;
