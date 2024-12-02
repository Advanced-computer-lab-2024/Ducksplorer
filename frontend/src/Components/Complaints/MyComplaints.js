// src/Components/MyComplaints.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Help from "../HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar.js";
import TouristSidebar from "../Sidebars/TouristSidebar.js";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
        const user = JSON.parse(userJson);
        const userName = user.username;
        const response = await axios.get(
          `http://localhost:8000/complaint/myComplaints/${userName}`
        );
        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };
    fetchMyComplaints();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
        }}
      >
        <TouristNavBar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        paddingTop: "64px", // Adjusted for fixed navbar spacing
      }}
    >
      <TouristNavBar />
      <TouristSidebar/>

      <Container
        maxWidth="md"
        sx={{ mt: 1, mb: 4, overflowY: "auto", height: "calc(100vh - 100px)" }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#00796b" }}
        >
          My Complaints
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {complaints.length > 0 ? (
          <Grid container spacing={3}>
            {complaints.map((complaint) => (
              <Grid item xs={12} key={complaint._id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      {complaint.title}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date:</strong>{" "}
                      {new Date(complaint.date).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      <strong>Body:</strong> {complaint.body}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: complaint.status ? "green" : "orange",
                        }}
                      >
                        {complaint.status ? "Resolved" : "Pending"}
                      </span>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      <strong>Replies:</strong>
                    </Typography>
                    {complaint.replies &&
                      complaint.replies.map((reply, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          color="textSecondary"
                        >
                          <strong>Date:</strong> {reply.date} - {reply.text}
                        </Typography>
                      ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 5 }}
          >
            <Typography variant="h6" color="textSecondary">
              No complaints found.
            </Typography>
          </Box>
        )}
        <Help />
      </Container>
    </Box>
  );
};

export default MyComplaints;
