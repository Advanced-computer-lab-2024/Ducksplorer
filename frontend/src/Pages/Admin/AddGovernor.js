import React, { useState } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import axios from "axios";
import Sidebar from "../../Components/Sidebars/Sidebar.js";
import { Box, Typography } from "@mui/material";
import AdminNavbar from "../../Components/TopNav/Adminnavbar.js";

function AddGovernor() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addGovernor",
        {
          userName,
          password,
          role: "Governor",
        }
      );
      if (response.status === 200) {
        message.success("Governor added successfully");
      } else {
        message.error("Failed to add Governor");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  return (
    <Box
    sx={{
      minHeight: "100vh", // Full viewport height
      width: "130%", // Full viewport width
      display: "flex",
      justifyContent: "center", // Center horizontally
      alignItems: "center", // Center vertically
      backgroundColor: "#ffffff",
      paddingTop: "64px", // Adjust for navbar height
      overflowY: "hidden", // Disable scrolling for cleaner centering
    }}
  >
    {/* Navbar */}
    <AdminNavbar />
    <Sidebar />
  
    {/* Main Content */}
    <Box
      sx={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#ffffff", // White card background
        borderRadius: "12px", // Rounded corners
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          color: "orange",
          fontWeight: "bold",
          textShadow: "2px 2px 4px #aaa",
          marginBottom: "24px",
        }}
      >
        Add Governor
      </Typography>
  
      {/* Logo */}
      <img
        src="logo1.png"
        style={{
          width: "150px",
          height: "150px",
          marginBottom: "24px",
        }}
        alt="Logo"
      />
  
      {/* Form */}
      <Stack spacing={3} sx={{ width: "100%" }}>
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
                borderColor: "orange",
              },
              "&:hover fieldset": {
                borderColor: "orange",
              },
              "&.Mui-focused fieldset": {
                borderColor: "orange",
              },
            },
          }}
        />
  
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
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    style={{ color: "orange", fontSize: "24px" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "orange",
              },
              "&:hover fieldset": {
                borderColor: "orange",
              },
              "&.Mui-focused fieldset": {
                borderColor: "orange",
              },
            },
          }}
        />
  
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: "orange",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "25px",
            padding: "10px 0",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#e68a00",
            },
          }}
          fullWidth
        >
          Add Governor
        </Button>
      </Stack>
    </Box>
  </Box>
  );
}  
export default AddGovernor;
