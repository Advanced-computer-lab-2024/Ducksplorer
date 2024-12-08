import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const TourGuideDashboard = () => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setTimeout(() => {
      setVideoEnded(true);
    }, 1000);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#fff6e6";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const lineChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Bookings",
        data: [10, 15, 12, 20, 30, 25, 40],
        borderColor: "#ff9933",
        backgroundColor: "rgba(255, 153, 51, 0.2)",
        pointBackgroundColor: "#ff9933",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["Itinerary A", "Itinerary B", "Itinerary C", "Itinerary D", "Itinerary E"],
    datasets: [
      {
        label: "Bookings",
        data: [50, 40, 60, 30, 70],
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
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  $1500
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
                  Total Booked Itineraries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  150
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
                  Total Active Itineraries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  75
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

      <TourGuideNavBar />
    </Box>
  );
};

export default TourGuideDashboard;
