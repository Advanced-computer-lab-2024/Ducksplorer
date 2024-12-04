import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Iconify from "../../Components/TopNav/iconify.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  console.log("username inside forget password is", userName);

  // Prevent scrolling and white border
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Disable scrolling
    document.body.style.height = "100%"; // Ensure full height
    document.body.style.width = "100%";

    return () => {
      // Reset styles when the component is unmounted
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/signUp/forgetPassword",
        {
          userName,
          password,
        }
      );
      if (response.status === 200) {
        message.success("Password changed successfully");
        localStorage.removeItem("userName");
        navigate("/login");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <Box style={styles.content}>
        <Typography variant="h4" style={styles.title}>
          Change Your Password
        </Typography>
        <Typography variant="h6" style={styles.subtitle}>
          Enter your new password below
        </Typography>
        <Stack spacing={2} mt={3}>
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={styles.button}
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Change Password"}
        </Button>
        {/* Back to Homepage Button */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          style={styles.backButton}
          onClick={handleBackToHome}
        >
          Back to Login
        </Button>
      </Box>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "url('/travelbg.jpg') no-repeat center center fixed",
    backgroundSize: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    background: "rgba(255, 255, 255, 0.9)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    margin: "auto",
    marginTop: "20vh",
    textAlign: "center",
  },
  title: {
    color: "#ff8c00",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#ff8c00",
    color: "#fff",
    marginTop: "20px",
  },
  backButton: {
    marginTop: "15px", // Add some spacing between buttons
    backgroundColor: "#fff",
    color: "#007bff",
  },
};

export default ForgetPassword;
