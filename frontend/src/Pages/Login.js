import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
  Stack,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Iconify from "../Components/TopNav/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

function Login() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message1, setMessage1] = useState(null);
  const navigate = useNavigate();
  localStorage.setItem("showPreferences", "false");


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Disable scrolling
    document.body.style.height = "100%"; // Ensure full height
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/signUp/login", {
        userName,
        password,
      });
      if (response.status === 200) {
        message.success("Logged in successfully");
        Cookies.set("jwt", response.data.token, { expires: 60 / 1440 });
        const userRole = response.data.role;
        const roleToDashboard = {
          Admin: "/AdminDashboard",
          Tourist: "/touristDashboard",
          Guide: "/tourGuideDashboard",
          Governor: "/governorDashboard",
          Advertiser: "/advertiserDashboard",
          Seller: "/sellerDashboard",
        };
        // window.location.href = roleToDashboard[userRole] || "/";
        // const userRole = response.data.role;
        // const roleToDashboard = {
        //   Admin: "/AdminDashboard",
        //   Tourist: "/touristDashboard",
        //   Guide: "/tourGuideDashboard",
        //   Governor: "/governorDashboard",
        //   Advertiser: "/advertiserDashboard",
        //   Seller: "/sellerDashboard",
        // };
        window.location.href = roleToDashboard[userRole] || "/";
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Login failed");
      message.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    try {
      localStorage.setItem("userName", userName);
      const response = await axios.get(
        `http://localhost:8000/signUp/getMail/${userName}`
      );

      if (response.status === 200) {
        setEmail(response.data.email);
        message.success("Email retrieved. Sending OTP...");

        // Send OTP immediately after retrieving email
        await handleSendOtp(response.data.email);
        setForgotPasswordOpen(true);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to retrieve email."
      );
    }
  };

  const handleSendOtp = async (emailToSend) => {
    try {
      const response = await fetch("http://localhost:8000/payment/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailToSend || email, // Use provided email or state email
        }),
      });
      if (response.status === 200) {
        message.success("OTP sent successfully.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "OTP sending failed.");
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8000/payment/confirm-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );
      console.log(response, email, otp);
      if (response.status === 200) {
        console.log("username", userName);
        localStorage.setItem("userName", userName);
        message.success("OTP verified. Redirecting to reset password page.");
        setForgotPasswordOpen(false);
        navigate("/forgetPassword");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <Typography variant="h3" style={styles.welcomeText} className="duckTitle" >
          Welcome to Ducksplorer
        </Typography>
        <Typography variant="h5" style={styles.descriptionText} className="duckTitle" >
          Get your ducks in a row.
        </Typography>
        {/* <Typography variant="h5" style={styles.descriptionText} className="duckTitle" >
          Login to continue your adventure.
        </Typography> */}
      </div>
      <div style={styles.rightSection}>
        <Box style={styles.content}>
          <Typography variant="h4" style={styles.title} className="duckTitle">
            Ducksplorer
          </Typography>
          {/* <Typography variant="h6" style={styles.subtitle} >
            Login to continue your adventure
          </Typography> */}
          <Stack spacing={2} mt={3}>
            <TextField
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
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
          </Stack>
          <Button
            disabled={!userName}
            onClick={() => {
              handleForgotPassword();
              handleSendOtp();
            }}
            style={{
              ...styles.link,
              cursor: userName ? "pointer" : "not-allowed",
              color: userName ? "#007bff" : "#aaa",
            }}
          >
            Forgot password?
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Typography variant="body2" style={styles.linkText}>
            Don't have an account?{" "}
            <Link to="/signUp" style={styles.link}>
              Sign Up
            </Link>
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            style={styles.backButton}
            onClick={handleBackToHome}
          >
            Back to Homepage
          </Button>
        </Box>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography>Email: {email}</Typography>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmOtp} color="primary">
            Verify OTP
          </Button>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "url('/travelbg.jpg') no-repeat center center fixed",
    backgroundSize: "cover",
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
    backgroundColor: "rgba(255,255,255,0.85)", // Light and very transparent orange
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
  content: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 11px 1px",
    textAlign: "center",
    backgroundColor: "white"
  },
  title: {
    color: "#ff8c00",
    fontWeight: "bold",
    marginBottom: "40px",
    fontSize: "30px",
    textAlign: "center"
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
  linkText: {
    marginTop: "10px",
    color: "#555",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: "15px",
    backgroundColor: "#fff",
    color: "#007bff",
  },
};

export default Login;
