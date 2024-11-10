import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import {  Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import { useNavigate } from "react-router-dom"; // Import to navigate to the edit page

function ViewMyProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const seller = user.username;
    axios.get(
      `http://localhost:8000/sellerRoutes/ViewMyProducts/${seller}`
    ).then(response => {
      message.success("Products fetched successfully");
      setProducts(response.data);
    }).catch(error => {
      console.error('There was an error fetching the products!', error);
    });
  }, []);

  const handleEditProduct = (productId) => {
    // Navigate to the edit product page with the product ID
    navigate(`/editProduct/${productId}`);
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Button onClick={handleBackButtonClick}>Back</Button>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "visible",
          padding: "10px",
          marginTop: "20px",
        }}
      >
        {/* Render the filtered products using the ProductCard component */}
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              style={{ position: "relative", marginBottom: "20px" }}
            >
              <ProductCard product={product} showArchive={true} showUnarchive={true} productID={product._id}/>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEditProduct(product._id)}
                style={{ position: "absolute", right: "10px", top: "10px" }} // Place the button at the top-right corner
              >
                Edit
              </Button>
            </div>
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No products found.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ViewMyProducts;
