import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Button } from "@mui/material";
import {
  Box,
  Typography,
  Drawer,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
} from "@mui/material";

import { useNavigate } from "react-router-dom"; // Import to navigate to the edit page
import NewProductCard from "../../Components/Products/newProductCard";

function AdminAllProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

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

  const handleEditProduct = (productId) => {
    // Navigate to the edit product page with the product ID
    navigate(`/editProduct/${productId}`);
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "90vw",
      }}
    >
      <Container sx={{ mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 9 }}>
          <Typography fontWeight="700" class="bigTitle">
            Admin Products
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
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                style={{
                  position: "relative",
                }}
              >
                <NewProductCard product={product} />
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
      </Container>
    </Box>
  );
}

export default AdminAllProducts;

{
  /* <ProductCard
                product={product}
                showArchive={true}
                showUnarchive={true}
              /> */
}
