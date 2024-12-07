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
import AdminNavBar from "../../Components/NavBars/AdminNavBar.js";

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
    <>
      <AdminNavBar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" style={styles.welcomeText}>
            Governor Management
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Box
            sx={{
              width: "100%", // Responsive width
              height: "100%", // Take full height
              backgroundColor: "#f9f9f9", // Same as the page background
              borderRadius: "16px", // Rounded corners
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow
              textAlign: "center",
              display: "flex", // Flexbox for centering
              flexDirection: "column", // Column direction
              justifyContent: "center", // Center vertically
              alignItems: "center", // Center horizontally
            }}
          >
            {/* Title Section */}
            <h2
              className="bigTitle"
              style={{
                textAlign: "center",
                alignSelf: "center",
                marginTop: "-20vh",
              }}
            >
              Add Governor
            </h2>

            {/* Logo Section */}
            <Box sx={{ marginBottom: "24px" }}>
              <img
                src="logo1.png"
                alt="Logo"
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  justifySelf: "center",
                  width: "150px",
                  height: "auto",
                  marginTop: "5vh",
                  marginBottom: "5vh",
                }}
              />
            </Box>

            {/* Form Section */}
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <Stack
                spacing={3}
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                {/* Username Field */}
                <TextField
                  name="username"
                  label="Username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#333",
                    },
                  }}
                  sx={{
                    width: "100%",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignContent: "center",
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
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#333",
                      width: "100%",
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
                    width: "100%",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignContent: "center",
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

                {/* Add Governor Button */}
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
                    width: "100%",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    "&:hover": {
                      backgroundColor: "#e68a00", // Darker hover color
                    },
                  }}
                  fullWidth
                >
                  Add Governor
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: 'url("/duckAdmin.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
    overflowY: "visible",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default AddGovernor;
