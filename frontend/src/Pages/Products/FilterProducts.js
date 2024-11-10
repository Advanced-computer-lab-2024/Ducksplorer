import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Button, Stack, TextField, Typography } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import useUserRole from "../../Components/getRole";
import Help from "../../Components/HelpIcon";

function FilterProducts() {
  const [minPrice, setMinPrice] = useState(""); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(""); // State for maximum price
  const [products, setProducts] = useState([]);
  const role = useUserRole();

  const handleFilterProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/filterProducts",
        {
          params: {
            minPrice, // Send minPrice as a query parameter
            maxPrice, // Send maxPrice as a query parameter
          },
        }
      );

      if (response.status === 200) {
        message.success("Products filtered successfully");
        setProducts(response.data); // Store the filtered products
      } else {
        message.error("Failed to filter products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Button onClick={handleBackButtonClick}>Back</Button>
      <h2>Filter Products by Price Range</h2>
      <Stack spacing={2}>
        <TextField
          label="Enter Minimum Price"
          type="number" // Ensure it's a number field
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          fullWidth
        />
        <TextField
          label="Enter Maximum Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterProducts}
        >
          Filter Products
        </Button>
      </Stack>

      <div
        style={{
          maxHeight: "400px",
          overflowY: "visible",
          padding: "10px",
          marginTop: "20px",
        }}
      >
        {/* Render the filtered products using the ProductCard component */}
        {role === "Admin" || role === "Seller" ? (
          products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              No products found.
            </Typography>
          )
        ) : products.filter((product) => product.isArchived !== true).length >
          0 ? (
          products
            .filter((product) => product.isArchived !== true)
            .map((product) => (
              <div
                key={product._id}
                style={{ position: "relative", marginBottom: "20px" }}
              >
                <ProductCard product={product} />
              </div>
            ))
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No products found.
          </Typography>
        )}
      </div>
      {role === "Tourist" && <Help />}
    </div>
  );
}

export default FilterProducts;
