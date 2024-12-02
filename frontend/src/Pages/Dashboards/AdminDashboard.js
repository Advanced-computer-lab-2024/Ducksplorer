import React, { useState, useEffect } from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebars/Sidebar";
import AdminNavbar from "../../Components/TopNav/Adminnavbar";

const AdminDashboard = () => {
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
      backgroundImage: 'url("/ducksplorer welcome.jpg")', // Fullscreen background image
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
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
      <source src="/planevid.mp4" type="video/mp4" />
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
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent black background
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
            background: "navy",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Welcome to Ducksplorer
        </Typography>
        <Typography variant="h5" sx={{ color: "navy" }}>
          Start your journey now!
        </Typography>
      </Box>
    )}

    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <AdminNavbar/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  </Box>
  );
};

export default AdminDashboard;
