import React, { useEffect, useState } from "react";
import TouristNavBar from "../../Components/TouristNavBar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
    const fetchOrders = async () => {

      if (!username) {
        setError("No username");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/touristRoutes/groupedPurchases/${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderNumber) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/touristRoutes/cancelOrder/${username}/${orderNumber}`
      );
      if (response.status === 200) {
        message.success("Order cancelled successfully");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderNumber !== orderNumber)
        );
      } else {
        message.error("Failed to cancel order");
      }

    } catch (error) {
      console.error(error);
    }
  };
  const handleViewDetails = (orderNumber) => {
    navigate(`/myPurchases/${orderNumber}`); // Navigate to the order details page
  };
  const handleBackButtonClick = () => {
    window.history.back();
  };


  return (
    <>
    <TouristNavBar />
    <Button onClick={handleBackButtonClick}>Back</Button>

    <Box
      sx={{
        padding: 3,
        maxWidth: "1200px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
  <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            My Orders
          </Typography>
        </Box>

  {error && (
    <Typography color="error" variant="body1" sx={{ textAlign: "center" }}>
      {error}
    </Typography>
  )}

  {!error && orders.length > 0 && (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total Quantity</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>More</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              hover
              sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {new Date(order.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.totalQuantity}</TableCell>
              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(order.orderNumber)}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  color={order.status === "Processing" ? "primary" : "secondary"}
                  onClick={() => handleCancelOrder(order.orderNumber)}
                  disabled={order.status !== "Processing"}
                  style={{
                    backgroundColor: order.status !== "Processing" ? "#d3d3d3" : "",
                    color: order.status !== "Processing" ? "#808080" : "",
                    cursor: order.status !== "Processing" ? "not-allowed" : "pointer",
                  }}
                >
  Cancel Order
</Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}

  {!error && orders.length === 0 && (
    <Typography
      variant="body1"
      sx={{ textAlign: "center", marginTop: 4, color: "gray" }}
    >
      No orders found.
    </Typography>
  )}
</Box>
</>
  );
};

export default OrdersPage;
