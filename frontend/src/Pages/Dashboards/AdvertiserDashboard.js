import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import AdvertiserNavBar from "../../Components/NavBars/AdvertiserNavBar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdvertiserDashboard = () => {
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
        label: "Acivities",
        data: [40, 15, 20, 12, 30, 25, 10],
        borderColor: "#ff9933",
        backgroundColor: "rgba(255, 153, 51, 0.2)",
        pointBackgroundColor: "#ff9933",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["Acivity A", "Acivity B", "Acivity C", "Acivity D", "Acivity E"],
    datasets: [
      {
        label: "Acivities",
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

      {videoEnded && (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
          <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
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
                  $950
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
                  Total Booked Acivities
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  100
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
                  Total Apropriate Acivities
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  60
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

      <AdvertiserNavBar />
    </Box>
  );
};

export default AdvertiserDashboard;
