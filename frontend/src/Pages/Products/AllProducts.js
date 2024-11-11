import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";

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
            gridGap: "40px",
          }}
        >
          {/* Render the filtered products using the ProductCard component */}
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                style={{
                  position: "relative",
                  marginBottom: "20px",
                  height: "60vh",
                  width: "30vw",
                  maxHeight: "100%",
                }}
              >
                <ProductCard key={product._id} product={product} />
              </div>
            ))
          ) : (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              No products found under the specified name.
            </Typography>
          )}
        </div>
        <Help />
      </div>
    </>
  );
}

export default AllProducts;
