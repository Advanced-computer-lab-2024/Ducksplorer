import React, { useEffect, useState } from "react";
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
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

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


  const handleViewDetails = (orderNumber) => {
    navigate(`/myPurchases/${orderNumber}`); // Navigate to the order details page
  };

  return (
    <Box
  sx={{
    padding: 3,
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  }}
>
  <Typography
    variant="h4"
    sx={{
      mb: 3,
      textAlign: "center",
      fontWeight: "bold",
      color: "transparent",
      backgroundClip: "text",
      textFillColor: "transparent",
      backgroundImage: "linear-gradient(to right, #3f51b5, #1e88e5)",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
      padding: 2,
      borderRadius: "8px",
    }}
  >
    My Orders
  </Typography>

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
  );
};

export default OrdersPage;
