import React, { useState, useEffect } from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import GuestNavBar from '../../Components/NavBars/GuestNavBar';
const GuestDashboard = () => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setTimeout(() => {
      setVideoEnded(true);
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
      backgroundColor: "#fef4ea",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <GuestNavBar/>
    {/* Background Video */}
    <video
      autoPlay
      muted
      onEnded={handleVideoEnd}
      style={{
        position: "fixed",
        top: 0,
        left: "5%",
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
          backgroundColor: "rgba(255, 254, 244, 0.8)", 
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
        className="duckTitle"
          variant="h3"
          sx={{
            color: "#ff9933",
            fontWeight: "bold",
            padding: "10px", // Optional padding to make the background more noticeable
            borderRadius: "8px", // Optional: To give the background rounded corners
            mb: 2,
          }}
        >
          Welcome to Ducksplorer
        </Typography>

        <Typography className="duckTitle" variant="h5" sx={{ color: "#ff9933", fontSize: "1.5rem" }}>
          Start your journey now!
        </Typography>
      </Box>
    )}

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  </Box>
  );
};

export default GuestDashboard;