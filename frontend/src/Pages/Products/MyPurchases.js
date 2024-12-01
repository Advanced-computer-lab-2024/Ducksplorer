import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography, Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";
function MyPurchases() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const username = user.username;
    axios
      .get(`http://localhost:8000/touristRoutes/myOrders/${username}`)
      .then((response) => {
        message.success("Purchases fetched successfully");
        setProducts(response.data);
        console.log("these are the products", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleBackButtonClick = () => {
    window.history.back();
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
        {products.length > 0 ? (
          products.map((item, index) => (
          <div
            key={item.product._id || index}
            style={{
              maxWidth: "600px", // Decrease card size
              margin: "auto", // Center each card
            }}
          >
            <ProductCard
              product={item.product}
              productID={item.product._id}
              showAddToCart={false}
              showReview={true}
              showRating={true}
              showAverageRating={true}   
              hideWishlist={true}         
            />
          </div>
        ))
      ) : (
        <h2>Your cart is empty!</h2>
      )}
        </div>
        <Help />
      </div>
    </>
  );
}

export default MyPurchases;
