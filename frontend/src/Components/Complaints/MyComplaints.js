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
import DuckLoading from "../../Components/Loading/duckLoading";

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
      <div>
        <DuckLoading />
      </div>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
      }}
    >
      <TouristNavBar />

      <Typography
        variant="h4"
        align="center"
        className="bigTitle"
        sx={{ marginBottom: "20px" }}
        gutterBottom
      >
        My Complaints
      </Typography>
      <Container
        maxWidth="md"
        sx={{
          mt: 1,
          mb: 4,
          overflowY: "visible",
          height: "100%",
        }}
      >
        {complaints.length > 0 ? (
          <Grid container spacing={3}>
            {complaints.map((complaint) => (
              <Grid item xs={12} key={complaint._id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: "orange",
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                      }}
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
      </Container>
    </Box>
  );
};

export default MyComplaints;
