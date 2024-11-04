import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';

const ComplaintsDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 

  useEffect(() => {
    fetchComplaints();
  }, [dateFilter, statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/complaint', {
        params: {
          date: dateFilter,
          status: statusFilter === "Resolved" ? true : statusFilter === "Pending" ? false : undefined
        }
      });
      setComplaints(response.data);
      setLoading(false);
      message.success('Complaints fetched successfully');
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch complaints. Please try again later.');
      console.error('Error fetching complaints:', error);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${id}`, { status: newStatus });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status: newStatus } : complaint
        )
      );
      message.success('Complaint status updated successfully');
    } catch (error) {
      message.error('Error updating complaint status');
      console.error('Error updating complaint status:', error);
    }
  };

  const handleOpenReplyDialog = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setOpenReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setOpenReplyDialog(false);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText) {
      message.error('Reply cannot be empty');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/complaint/${selectedComplaintId}/reply`, { reply: replyText });
      message.success('Reply sent successfully');
      handleCloseReplyDialog();
      fetchComplaints();
    } catch (error) {
      message.error('Failed to send reply');
      console.error('Error sending reply:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: "visible", marginTop: 50, width: '180vh' }}>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <CircularProgress size={50} thickness={5} color="primary" />
          <Typography variant="h6" sx={{ marginTop: 2, color: '#00796b' }}>
            Loading complaints, please wait...
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ width: '100%', boxShadow: 3, mt:0, marginTop: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={4} sx={{ padding: 0, backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: 3, py: 2 }}>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#00796b' }}>
                        Complaints
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Filter by Date</InputLabel>
                          <Select
                            label="Filter by Date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                          >
                            <MenuItem value="">All Dates</MenuItem>
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="oldest">Oldest</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Filter by Status</InputLabel>
                          <Select
                            label="Filter by Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow sx={{ backgroundColor: '#00796b' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {complaints.length > 0 ? (
                  complaints.map((complaint, index) => (
                    <TableRow key={complaint._id} sx={{ backgroundColor: index % 2 === 0 ? '#f1f8e9' : '#ffffff' }}>
                      <TableCell sx={{ fontSize: '13px', textAlign: 'center' }}>{complaint.title}</TableCell>
                      <TableCell sx={{ fontSize: '13px', textAlign: 'center' }}>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontSize: '13px', textAlign: 'center' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: complaint.status ? 'green' : 'orange',
                            fontWeight: 'bold'
                          }}
                        >
                          {complaint.status ? 'Resolved' : 'Pending'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          onClick={() => updateComplaintStatus(complaint._id, !complaint.status)}
                          variant="contained"
                          color={complaint.status ? 'warning' : 'success'}
                          size="small"
                          sx={{ minWidth: '100px', fontSize: '12px' }}
                        >
                          {complaint.status ? 'Mark as Pending' : 'Mark as Resolved'}
                        </Button>
                        <Button
                          component={Link}
                          to={`/admin/complaints/${complaint._id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ minWidth: '100px', fontSize: '12px' }}
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleOpenReplyDialog(complaint._id)}
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ minWidth: '80px', fontSize: '12px' }}
                        >
                          Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: '20px', color: 'gray', fontSize: '14px' }}>
                      No complaints available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={openReplyDialog} onClose={handleCloseReplyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to Complaint</DialogTitle>
        <DialogContent sx={{ minHeight: '200px' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Reply"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendReply} color="primary" variant="contained">
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintsDashboard;
