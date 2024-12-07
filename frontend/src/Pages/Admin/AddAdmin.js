import React, { useState } from "react";
import { Typography, Box, Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { message } from "antd";
import Iconify from "../../Components/TopNav/iconify.js";
import axios from "axios";
import Sidebar from "../../Components/Sidebars/Sidebar.js";
import AdminNavBar from "../../Components/NavBars/AdminNavBar.js";
function AddAdmin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addAdmin",
        {
          userName,
          password,
          role: "Admin",
        }
      );
      if (response.status === 200) {
        message.success("Admin added successfully");
        setUserName("");
        setPassword("");
      } else {
        message.error("Failed to add admin");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full viewport height
        backgroundColor: "#ffffff", // Consistent background
        display: "flex", // Flex layout
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      {/* Navbar and Sidebar */}
      <AdminNavBar />
      <Sidebar />

      {/* Form Card */}
      <Box
        sx={{
          maxWidth: "500px", // Limit width for responsiveness
          width: "90%", // Responsive width
          backgroundColor: "#f9f9f9", // Same as the page background
          borderRadius: "16px", // Rounded corners
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow
          padding: "32px",
          textAlign: "center",
        }}
      >
        {/* Title Section */}
        <Typography
          variant="h4"
          sx={{
            color: "#ff9800",
            fontWeight: "bold",
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow
            marginBottom: "24px",
          }}
        >
          Add Admin
        </Typography>

        {/* Logo Section */}
        <Box sx={{ marginBottom: "24px" }}>
          <img
            src="logo1.png"
            alt="Logo"
            style={{
              width: "150px",
              height: "auto",
            }}
          />
        </Box>

        {/* Form Section */}
        <Stack spacing={3}>
          {/* Username Field */}
          <TextField
            name="username"
            label="Username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#777" } }}
            InputProps={{
              style: {
                fontSize: "16px",
                color: "#333",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff9800",
                },
                "&:hover fieldset": {
                  borderColor: "#ff9800",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff9800",
                },
              },
            }}
          />

          {/* Password Field */}
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#777" } }}
            InputProps={{
              style: {
                fontSize: "16px",
                color: "#333",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={
                        showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                      }
                      style={{ color: "#ff9800", fontSize: "20px" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff9800",
                },
                "&:hover fieldset": {
                  borderColor: "#ff9800",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff9800",
                },
              },
            }}
          />

          {/* Add Admin Button */}
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "25px",
              padding: "12px 24px",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#e68a00", // Darker hover color
              },
            }}
            fullWidth
          >
            Add Admin
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default AddAdmin;
