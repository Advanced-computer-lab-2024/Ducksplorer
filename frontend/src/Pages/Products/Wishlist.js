import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;

    axios
      .get(`http://localhost:8000/touristRoutes/myWishlist/${userName}`)

      .then((response) => {
        message.success("wishlist fetched successfully");
        setProducts(response.data[0].products);
        console.log("these are the products", response.data[0].products);
      })
      .catch((error) => {
        console.error("There was an error fetching the wishlist!", error);
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

  return (
    <>
      <TouristNavBar />
      <Button onClick={handleBackButtonClick}>Back</Button>
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
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              No products found in your wishlist.
            </Typography>
          )}
        </div>
        <Help />
      </div>
    </>
  );
}

export default Wishlist;
