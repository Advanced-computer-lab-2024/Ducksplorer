// src/Components/ComplaintDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Paper, CircularProgress, Box, Divider } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';

const ComplaintDetails = () => {
  const { id } = useParams(); // Get the complaint ID from the URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/complaint/${id}`);
        setComplaint(response.data);
      } catch (error) {
        setError('Failed to fetch complaint details');
        if (error.response) {
          if (error.response.status === 404) {
            setError('Complaint not found');
          } else if (error.response.status === 500) {
            setError('Server error, please try again later');
          }
        } else {
          setError('Network error, please check your connection');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaintDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
          Loading complaint details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error" textAlign="center">{error}</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold' }}>
          Complaint Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {/* Title */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Title:
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ ml: 1 }}>
            {complaint.title}
          </Typography>
        </Box>

        {/* Date */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Date:
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ ml: 1 }}>
            {new Date(complaint.date).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Status:
          </Typography>
          <Typography variant="body1" sx={{ color: complaint.status ? 'green' : 'orange', ml: 1 }}>
            {complaint.status ? 'Resolved' : 'Pending'}
          </Typography>
        </Box>

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Description:
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ ml: 1 }}>
            {complaint.body}
          </Typography>
        </Box>

        {/* Response */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold' }}>
            Response:
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ ml: 1 }}>
            {complaint.response || 'No response yet'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ComplaintDetails;
  