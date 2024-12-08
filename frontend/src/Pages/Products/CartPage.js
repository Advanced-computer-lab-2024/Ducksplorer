import React, { useState, useEffect } from "react";
import axios from "axios";

import { message, Button, Modal } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import DuckLoading from "../../Components/Loading/duckLoading";
import Help from "../../Components/HelpIcon";
import NewProductCard from "../../Components/Products/newProductCard";

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0); // State to store total pric
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); // Controls the modal visibility
  const userJson = localStorage.getItem("user"); // Get the logged-in user's details
  const user = JSON.parse(userJson);
  const userName = user.username;
  const navigate = useNavigate();

  const handleRemoveProduct = (productId) => {
    setCartProducts((prevProducts) =>
      prevProducts.filter((item) => item.product._id !== productId)
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleConfirmCheckout = async () => {
    try {
      const orderNumberStr = localStorage.getItem("orderNumber") || 0; // Get the order number from localStorage
      const orderNumber = +orderNumberStr;
      localStorage.setItem("orderNumber", orderNumber + 1); // Increment the order number

      for (const item of cartProducts) {
        // Extract details
        const { product, quantity } = item;

        // Call the backend API
        const response = await axios.put(
          "http://localhost:8000/touristRoutes/addPurchase",
          {
            userName,
            productId: product._id,
            chosenQuantity: quantity,
            orderNumber: orderNumber,
          }
        );
        const type = "product";

        localStorage.setItem("cartId", cartProducts._id);
        localStorage.setItem("type", type);
        if (response.status === 201) {
          navigate("/payment");
        }
      }

      // Optionally clear the cart (both frontend and backend)
      setCartProducts([]); // Clear frontend cart state
      // Close the checkout modal
      setIsCheckoutModalVisible(false);
    } catch (error) {
      console.error("Error during checkout:", error);
      message.error("An error occurred during checkout. Please try again.");
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartProducts.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
      setTotalPrice(total); // Update the total price state
    };

    calculateTotalPrice();
    localStorage.setItem("totalPrice", totalPrice);
  }, [cartProducts]);

  useEffect(() => {
    const fetchCart = async () => {
      console.log(userName);
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myCart/${userName}`
        );

        if (response.status === 200) {
          // Extract products from the cart
          const cartData = response.data.cart;
          if (!cartData) {
            setCartProducts([]); // Set an empty list for display
            message.info("Your cart is empty.");
          } else {
            setCartProducts(cartData.products); // Populate with product details
            message.success("cart loaded successfully!");
          }
        } else {
          message.error("Failed to fetch cart details.");
        }
      } catch (error) {
        console.error(error);
        message.error("An error occurred while fetching the cart.");
      } finally {
        setTimeout(() => setLoading(false), 1000); // Delay of 1 second
      }
    };

    fetchCart();
  }, [userName]);

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  return (
    <Box sx={{ height: "100vh", width: "90vw" }}>
      <TouristNavBar />

      <Container sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography fontWeight="700" class="bigTitle">
            My Cart
          </Typography>
        </Box>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 cards per row
            gap: "24px", // Spacing between cards
            paddingBottom: 24,
            width: "100%",
          }}
        >
          {cartProducts.length > 0 ? (
            cartProducts.map((item, index) => (
              <NewProductCard product={item.product} />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Stack image and text vertically
                alignItems: "center", // Center both horizontally
                justifyContent: "center", // Center vertically within the parent
                marginBottom: "2rem", // Space below the image and text
                alignContent: 'center'
              }}
            >
              <img
                src="DuckEmptyCart.jpg"
                alt="Duck Empty Cart"
                style={{
                  width: "70%", // Adjust the image size for better responsiveness
                  maxWidth: "400px", // Set a max width for better scaling
                  height: "auto",
                }}
              />
              <p
                style={{
                  marginTop: "1rem", // Add spacing between the image and text
                  fontSize: "1.2rem", // Adjust the text size
                  textAlign: "center", // Center-align the text
                  color: "#555", // Change color for better contrast
                }}
              >
                Your Cart is Empty, Start shopping now!
              </p>
            </div>
          )}
        </div>
        {cartProducts.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setIsCheckoutModalVisible(true)}
              style={{
                backgroundColor: "#ff9933", // Ensure visible background color
                color: "#fff",
                "&:hover": { backgroundColor: "#e68a00" },
                border: "none", // Remove any conflicting borders
                padding: "10px 20px",
                fontSize: "1.2rem",
                borderRadius: "5px", // Add a clear shape
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
                transition: "background-color 0.3s ease", // Smooth transition for hover
              }}
            >
              Checkout
            </Button>
          </div>
        )}
        {/* Checkout Modal */}
        <Modal
          title="Checkout"
          visible={isCheckoutModalVisible}
          onCancel={() => setIsCheckoutModalVisible(false)} // Close the modal
          footer={null} // Footer is empty; we'll handle the confirm button inside
        >
          <div style={{ textAlign: "center" }}>
            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            <Button
              type="primary"
              size="large"
              onClick={handleConfirmCheckout} // Call the handler
              style={{
                backgroundColor: "#ff9933", // Ensure visible background color
                color: "#fff", // Ensure text is visible
                border: "none", // Remove any conflicting borders
                padding: "10px 20px",
                fontSize: "1.2rem",
                borderRadius: "5px", // Add a clear shape
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
                transition: "background-color 0.3s ease", // Smooth transition for hover
              }}
            >
              Confirm
            </Button>
          </div>
        </Modal>
        <Help />
      </Container>
    </Box>
  );
};

export default CartPage;
