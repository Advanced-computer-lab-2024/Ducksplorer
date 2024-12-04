import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Typography, Button } from "@mui/material";
import ProductCard from "../../Components/Products/ProductCard"; // Import the ProductCard component
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]); // Use state for products
  const { orderNumber } = useParams();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
        const user = JSON.parse(userJson);
        const username = user.username;

        const response = await axios.get(
          `http://localhost:8000/touristRoutes/orderDetails/${orderNumber}`
        );
        message.success("Purchases fetched successfully");
        const fetchedPurchases = response.data.purchases;
        setPurchases(fetchedPurchases);

        // Fetch product details for each purchase
        for (const purchase of fetchedPurchases) {
          await fetchProductDetail(purchase.product);
        }
      } catch (error) {
        console.error("There was an error fetching the purchases!", error);
      }
    };

    fetchPurchases();
  }, [orderNumber]);

  const fetchProductDetail = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/getOrderProducts/${productId}`
      );
      const productDetail = response.data;
      console.log("Fetched product detail:", productDetail);

      // Add the fetched product detail to the products state
      setProducts((prevProducts) => [...prevProducts, productDetail]);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

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
                key={item._id || index} // Use _id or index as fallback
                style={{
                  maxWidth: "600px",
                  margin: "auto",
                }}
              >
                <ProductCard
                  product={item} // Pass the full product object
                  productID={item._id}
                  showAddToCart={false}
                  showReview={true}
                  showRating={true}
                  showAverageRating={true}
                  hideWishlist={true}
                  showPurchase={true} 
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
