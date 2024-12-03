import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../Components/Products/ProductCard"; // Adjust the path as necessary
import { message, Button, Modal } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
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
        //await axios.delete("http://localhost:8000/touristRoutes/cart", { params: { userName ,productId: product._id } }); // Clear product from cart
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
      }
    };

    fetchCart();
  }, [userName]);

  return (
    <Box syle = {{overflowY: 'visible', height: '100vh'}}>
      <TouristNavBar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 3 cards per row
          gap: "20px", // Spacing between cards
          padding: "20px",
          justifyContent: "center",
          overflowY: 'visible'
        }}
      >
        {cartProducts.length > 0 ? (
          cartProducts.map((item, index) => (
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
                showReview={false}
                showRating={false}
                showAverageRating={true}
                isConfirmButtonVisible={true}
                inCartQuantity={item.quantity}
                onProductRemove={handleRemoveProduct} // Pass the handler
                onQuantityChange={handleQuantityChange} // Pass the handler for quantity changes
              />
            </div>
          ))
        ) : (
          <h2>Your cart is empty!</h2>
        )}
      </div>
      {cartProducts.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsCheckoutModalVisible(true)}
            style={{
              backgroundColor: "#1890ff", // Ensure visible background color
              color: "#fff", // Ensure text is visible
              border: "none", // Remove any conflicting borders
              padding: "10px 20px",
              fontSize: "1.2rem",
              borderRadius: "5px", // Add a clear shape
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
              transition: "background-color 0.3s ease", // Smooth transition for hover
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")} // Optional hover effect
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
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
              backgroundColor: "#1890ff", // Ensure visible background color
              color: "#fff", // Ensure text is visible
              border: "none", // Remove any conflicting borders
              padding: "10px 20px",
              fontSize: "1.2rem",
              borderRadius: "5px", // Add a clear shape
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
              transition: "background-color 0.3s ease", // Smooth transition for hover
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")} // Optional hover effect
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </Box>
  );
};

export default CartPage;
