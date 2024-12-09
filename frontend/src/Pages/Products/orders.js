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
import Help from "../../Components/HelpIcon";
import Swal from "sweetalert2";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!username) {
        setError("No username found");
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
  }, [username]);

  const handleCancelOrder = async (orderNumber, totalPrice) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/touristRoutes/cancelOrder/${username}/${orderNumber}`, {
          data: {totalPrice}
        }
      );
      if (response.status === 200) {
        message.success("Order cancelled successfully");
        await fetchWalletBalance(username);
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
    navigate(`/myPurchases/${orderNumber}`);
  };

  const fetchWalletBalance = async (userName) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/balance/${userName}`
      );

      // Extract the wallet balance from the response
      const wallet = response.data;
      console.log("res is ", response.data);
      console.log("balance is", wallet);

      // Display wallet balance in a SweetAlert popup
      await Swal.fire({
        title: "Wallet Balance",
        text: `Your new wallet balance is $${wallet}`,
        icon: "info",
        customClass: {
          icon: "custom-icon-color", // Use this class to style the icon
        },
        confirmButtonText: "OK",
      });

      // Return the wallet balance if needed for further use
      return wallet;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);

      // Show an error popup if something goes wrong
      await Swal.fire({
        title: "Error",
        text: "Failed to fetch wallet balance. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      throw error; // Rethrow the error if you want to handle it elsewhere
    }
  };

  return (
    <>
      <TouristNavBar />
      <Box sx={{ padding: 3, maxWidth: "1200px", margin: "auto" , overflowY: 'visible', height: '100vh'}}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700" className="bigTitle">
            My Orders
          </Typography>
        </Box>
        {error ? (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : orders.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "12px" }}
            elevation={3}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
                  {[
                    "Order Number",
                    "Status",
                    "Date",
                    "Total Quantity",
                    "Total Price",
                    "Actions",
                  ].map((text) => (
                    <TableCell
                      key={text}
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ textAlign: "center" }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {order.status}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {order.totalQuantity}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="small"
                        className="blackhover"
                        sx={{
                          marginRight: 2,
                          backgroundColor: "#ff9933",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#e68a00" },
                        }}
                        onClick={() => handleViewDetails(order.orderNumber)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order.orderNumber, order.totalPrice)}
                        disabled={order.status !== "Processing"}
                        sx={{
                          backgroundColor:
                            order.status !== "Processing" ? "#d3d3d3" : "red",
                          color:
                            order.status !== "Processing" ? "#808080" : "#fff",
                          cursor:
                            order.status !== "Processing"
                              ? "not-allowed"
                              : "pointer",
                          "&:hover": {
                            backgroundColor:
                              order.status === "Processing"
                                ? "#b71c1c"
                                : "#d3d3d3",
                          },
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
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginTop: 4, color: "gray" }}
          >
            No orders found.
          </Typography>
        )}
      </Box>
      <Help />
    </>
  );
};

export default OrdersPage;
