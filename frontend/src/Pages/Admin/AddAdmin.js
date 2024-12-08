import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { message } from "antd";
import Iconify from "../../Components/TopNav/iconify.js";
import axios from "axios";
import AdminNavBar from "../../Components/NavBars/AdminNavBar.js";
import NavigationTabs from "../../Components/NavigationTabs.js";

function AddAdmin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const tabs = ["Add Admin", "Add Governor"];
  const paths = ["/addAdmin", "/addGovernor"];

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
        throw new Error(response.error);
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Adding failed");
      message.error(error.response?.data?.error || "Adding failed");
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <AdminNavBar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography
            variant="h3"
            className="duckTitle"
            style={styles.welcomeText}
          >
            Add Users
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f9f9f9",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Chips Section */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "5%",
                position: "relative",
                top: "-25%",
              }}
            >
              <div>
                <NavigationTabs tabNames={tabs} paths={paths} />
              </div>
            </Box>

            {/* Title Section */}
            <h2
              className="bigTitle"
              style={{
                textAlign: "center",
                alignSelf: "center",
                marginBottom: "5%",
                position: "relative", // Add this to use 'top'
                marginTop: "-20%",
              }}
            >
              Add Admin
            </h2>

            {/* Logo Section
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
            </Box> */}

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
                    },
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
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
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                  }}
                />

                {/* Add Admin Button */}
                <Button
                  variant="contained"
                  className= "blackhover"
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
                  }}
                  fullWidth
                >
                  Add Admin
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
    height: "120vh",
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
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default AddAdmin;
