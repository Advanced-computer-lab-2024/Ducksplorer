import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { message } from "antd";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userJson = localStorage.getItem("user"); // Get the logged-in user
      const user = JSON.parse(userJson);
      const username = user.username;

      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myPurchases/${username}` // Assuming this endpoint fetches orders for a user
        );
        if (response.status === 200) {
          setOrders(response.data);
          message.success("Orders fetched successfully!");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = async (orderNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/myOrder`, // New backend function
        { orderNumber } // Send the orderNumber in the body
      );

      if (response.status === 200) {
        setSelectedOrderProducts(response.data);
        message.success("Order details fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        Your Orders
      </Typography>

      {orders.map((order) => (
        <div
          key={order.orderNumber}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h6">
            Order Number: {order.orderNumber}
          </Typography>
          <Typography>Status: {order.status}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewDetails(order.orderNumber)}
            style={{ marginTop: "10px" }}
          >
            View Details
          </Button>
        </div>
      ))}

      {selectedOrderProducts.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Order Products
          </Typography>
          <ul>
            {selectedOrderProducts.map((product, index) => (
              <li key={index}>
                <Typography>
                  {product.name} - Quantity: {product.quantity}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
