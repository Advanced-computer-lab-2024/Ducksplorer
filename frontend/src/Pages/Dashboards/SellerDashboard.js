import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CssBaseline } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { Outlet } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import SellerNavBar from "../../Components/NavBars/SellerNavBar";

const SellerDashboard = () => {
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

  const lineChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Products Sold",
        data: [12, 15, 10, 34, 40, 25, 20],
        borderColor: "#ff9933",
        backgroundColor: "rgba(255, 153, 51, 0.2)",
        pointBackgroundColor: "#ff9933",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["zaw", "zawzamoon", "me", "kelya", "test gameel"],
    datasets: [
      {
        label: "Products Sold",
        data: [30, 50, 40, 70, 60],
        backgroundColor: [
          "#cc7a1a", // Darker shade for highest
          "#d98a33",
          "#e6994c",
          "#f2a966",
          "#ffbf80", // Lightest shade for lowest
        ],
      },
    ],
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#fff6e6",
      }}
    >
      <video
        autoPlay
        muted
        onEnded={handleVideoEnd}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: videoEnded ? -1 : 0,
          opacity: videoEnded ? 0 : 1,
          transition: "opacity 1s ease-out",
        }}
      >
        <source src="/planevidd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Welcome Message with Semi-Transparent Box */}
      {videoEnded && (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Grid container spacing={2} sx={{ marginBottom: "90px", marginTop: "20px" }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle">
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }} >
                $20000
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle">
                Total Products Sold
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                250
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle">
                Frequently Purchased
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                kelya
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ height: "300px" }}>
              <Line data={lineChartData} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ height: "300px" }}>
              <Bar data={barChartData} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CssBaseline />
        <SellerNavBar /> {/* Add SellerNavbar */}
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* <SellerSidebar /> Add SellerSidebar */}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
