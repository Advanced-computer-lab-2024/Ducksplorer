import React, { useState, useEffect } from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import { Outlet } from "react-router-dom";
import TouristNavBar from "../../Components/TouristNavBar";
import Help from "../../Components/HelpIcon";

const TouristDashboard = () => {
  const [videoEnded, setVideoEnded] = useState(localStorage.getItem('videoEnded') === 'true');

  const handleVideoEnd = () => {
    setTimeout(() => {
      setVideoEnded(true);
      localStorage.setItem('videoEnded', 'true');
      document.body.style.backgroundColor = "#FEF4EA"; // Change background color when video ends
    }, 1000); // Delay to allow fade-out animation
  };

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";
    // Set background color for the whole page
    document.body.style.backgroundColor = "#bce4e4";

    // Re-enable scrolling and reset background color on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh", // Covers the full viewport
        overflow: "hidden",
        backgroundColor: "#fff6e6",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: videoEnded ? "#FEF4EA" : "#bce4e4", // Change background color behind the whole page
      }}
    >
      {/* Background Video */}
      {!videoEnded && (
        <video
          autoPlay
          muted
          onEnded={handleVideoEnd}
          style={{
            position: "fixed",
            top: 0,
            left: "0%",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: videoEnded ? -1 : 0, // Hide video after it ends
            opacity: videoEnded ? 0 : 1, // Fade-out effect
            transition: "opacity 1s ease-out", // Smooth fade-out
          }}
        >
          <source src="/planevidd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Welcome Message with Semi-Transparent Box */}
      {videoEnded && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            textAlign: "center",
            color: "white",
            backgroundColor: "rgba(255, 254, 244, 0.8)", // Make the box behind the text dimmer
            padding: "40px",
            borderRadius: "12px",
            animation: "fadeIn 1.5s ease-out", // Smooth fade-in for text
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: "orange",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
          <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "50px", color: "orange" }} className="bigTitle"> {/* Increased text size */}
            Welcome to Ducksplorer
          </Typography>
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "orange"}} className="bigTitle"> {/* Increased text size */}
            Start your journey now!
          </Typography>
        </Box>
      )}

      {/* Main Dashboard Content */}
      <CssBaseline />
      <TouristNavBar />
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
      <Help />
    </Box>
  );
};

export default TouristDashboard;
