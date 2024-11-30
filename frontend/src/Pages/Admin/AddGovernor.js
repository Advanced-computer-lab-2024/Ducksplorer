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
import { Box } from "@mui/material";
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
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      paddingTop: "64px", // Adjust for navbar height
      overflowY: "auto",
    }}
  >
    {/* Navbar */}
    <AdminNavbar />
      <Sidebar />
      <div style={{ height: "80vh", transform: "translateX(125px)" }}>
        <div className="text-center">
          <h4
            className="mt-1 mb-5 pb-1"
            style={{
              color: "orange",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px #aaa",
            }}
          >
            Add Governor
          </h4>
          <img
            src="logo1.png"
            style={{
              width: "300px",
              height: "200px",
              justifyContent: "center",
            }}
            alt="logo"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={3}>
            <TextField
              name="username"
              label="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={password}
              height="50"
              width="20"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
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
                        style={{ color: "#602b37", fontSize: "40px" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              style={{
                width: "300px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Add Governor
            </Button>
          </Stack>
        </div>
      </div>
    </Box>
  );
}

export default AddGovernor;
