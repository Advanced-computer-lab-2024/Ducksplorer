import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography, Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard";
// Import the ProductCard component

function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/adminRoutes/getproducts")
      .then((response) => {
        message.success("Products fetched successfully");
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div
      className="tester"
      style={{
        padding: "20px",
        maxWidth: "1600px",
        margin: "auto",
      }}
    >
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
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No products found under the specified name.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
