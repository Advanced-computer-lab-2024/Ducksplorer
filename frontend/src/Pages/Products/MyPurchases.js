import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Typography, Rating, Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
function MyPurchases() {
  const [products, setProducts] = useState([]);
  const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
  const user = JSON.parse(userJson);
  const username = user.username;
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    rating: [],
    review: [],
  });

  console.log(username);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/touristRoutes/myPurchases/${username}`)
      .then((response) => {
        message.success("Purchases fetched successfully");
        setProducts(response.data[0].products);
        console.log("these are the products", response.data[0].products);
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
              />
              <Button
                variant="contained"
                color="primary"
                style={{ position: "absolute", right: "10px", top: "10px" }} // Place the button at the top-right corner
              >
                Add Review
              </Button>
            </div>
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

export default MyPurchases;
