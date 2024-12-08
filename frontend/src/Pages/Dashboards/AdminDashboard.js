import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CssBaseline } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/NavBars/AdminNavBar";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Report';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Import a more suitable icon for Revenue Reports

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    setTimeout(() => {
      setVideoEnded(true);
    }, 1000); // Delay to allow fade-out animation
  };

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling and reset background color on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const lineChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "New Users",
        data: [5, 4, 12, 7, 25, 22, 35],
        borderColor: "#FFA500", // Orange
        backgroundColor: "rgba(255, 165, 0, 0.2)", // Light orange
        pointBackgroundColor: "#FF8C00", // Darker orange
        fill: true,
        tension: 0.4, // Add tension to the line to make it curved
      },
    ],
  };

  const barChartData = {
    labels: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
    datasets: [
      {
        label: "Products",
        data: [30, 50, 40, 70, 60],
        backgroundColor: [
          "rgba(255, 165, 0, 0.8)", // Light orange
          "rgba(255, 140, 0, 0.8)", // Darker orange
          "rgba(255, 120, 0, 0.8)", // Even darker orange
          "rgba(255, 100, 0, 0.8)", // More darker orange
          "rgba(255, 80, 0, 0.8)",  // Darkest orange
        ],
      },
    ],
  };

  const handleCardClick = (path) => {
    navigate(`/${path}`);
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

      {videoEnded && (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
          <Grid container spacing={3} sx={{ marginBottom: "100px", marginTop:"20px"}}> {/* Increased spacing and marginBottom for more space between cards and graphs */}
            <Grid item xs={12} md={3}>
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
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick("admin/complaints")}
              >
                <ReportIcon sx={{ fontSize: 40, color: "black", mb: 1 }} /> {/* Added marginBottom for space between icon and text */}
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle"> {/* Increased text size */}
                  Complaints
                </Typography>
                {/* <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  View Complaints
                </Typography> */}
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
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
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick("adminReport")}
              >
                <AttachMoneyIcon sx={{ fontSize: 40, color: "black", mb: 1 }} /> {/* Changed icon and added marginBottom for space between icon and text */}
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle"> {/* Increased text size */}
                  Revenue Reports
                </Typography>
                {/* <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  View Reports
                </Typography> */}
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
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
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick("Adminproducts")}
              >
                <ShoppingCartIcon sx={{ fontSize: 40, color: "black", mb: 1 }} /> {/* Added marginBottom for space between icon and text */}
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle"> {/* Increased text size */}
                  Products Management
                </Typography>
                {/* <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Manage Products
                </Typography> */}
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
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
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick("ViewAllActivities")}
              >
                <EventIcon sx={{ fontSize: 40, color: "black", mb: 1 }} /> {/* Added marginBottom for space between icon and text */}
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }} className="bigTitle"> {/* Increased text size */}
                  View Events
                </Typography>
                {/* <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  View Events
                </Typography> */}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}> {/* Increased spacing between graphs */}
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
        <AdminNavbar />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
