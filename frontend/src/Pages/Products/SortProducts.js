// FilterProducts.js
import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Button, Stack, Typography } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import useUserRole from "../../Components/getRole";
import Help from "../../Components/HelpIcon";

function SortProducts() {
  const [products, setProducts] = useState([]);
  const role = useUserRole();

  const handleSortAscProducts = async () => {
    // console.log(price);
    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/sortProducts",
        {
          params: { sortingDecider: "1" }, // Pass sortingDecider as a query param
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

  const handleSortDescProducts = async () => {
    // console.log(price);
    try {
      const response = await axios.get(
        "http://localhost:8000/adminRoutes/sortProducts",
        {
          params: { sortingDecider: "0" }, // Pass sortingDecider as a query param
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
      <h2>Sort Products</h2>
      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSortAscProducts}
        >
          Sort Products Asc
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSortDescProducts}
        >
          Sort Products Desc
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
      <Help />
    </div>
  );
}

export default SortProducts;
