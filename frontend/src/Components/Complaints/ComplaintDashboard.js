import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { message } from "antd";
import { Link } from "react-router-dom";
import AdminNavbar from "../TopNav/Adminnavbar";
import DuckLoading from "../Loading/duckLoading";
import Help from "../HelpIcon";

const ComplaintsDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [dateFilter, statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/complaint", {
        params: {
          date: dateFilter,
          status:
            statusFilter === "Resolved"
              ? true
              : statusFilter === "Pending"
              ? false
              : undefined,
        },
      });
      setComplaints(response.data);
      setLoading(false);
      message.success("Complaints fetched successfully");
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch complaints. Please try again later.");
      console.error("Error fetching complaints:", error);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${id}`, {
        status: newStatus,
      });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status: newStatus } : complaint
        )
      );
      message.success("Complaint status updated successfully");
    } catch (error) {
      message.error("Error updating complaint status");
      console.error("Error updating complaint status:", error);
    }
  };

  const handleOpenReplyDialog = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setOpenReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setOpenReplyDialog(false);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText) {
      message.error("Reply cannot be empty");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/complaint/${selectedComplaintId}/reply`,
        { reply: replyText }
      );
      message.success("Reply sent successfully");
      handleCloseReplyDialog();
      fetchComplaints();
    } catch (error) {
      message.error("Failed to send reply");
      console.error("Error sending reply:", error);
    }
  };

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
        width: "90vw",
        marginLeft: "5vw",
      }}
    >
      <AdminNavbar />
      <Box
        sx={{
          flex: 1,
          padding: "32px",
          margin: "0 auto",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h2"
          sx={{ textAlign: "center", fontWeight: "bold", paddingRight: "5%" }}
        >
          Complaints
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            margin: "5%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            borderRadius: "1.5cap",
          }}
        >
          {" "}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      <InputLabel sx={{ backgroundColor: "#ffeccc" }}>
                        Sort by Date
                      </InputLabel>
                      <Select
                        label="Sort by Date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        sx={{ backgroundColor: "#ffeccc" }}
                      >
                        <MenuItem value="">All Dates</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      <InputLabel sx={{ backgroundColor: "#ffeccc" }}>
                        Filter by Status
                      </InputLabel>
                      <Select
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ backgroundColor: "#ffeccc" }}
                      >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell
                      sx={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {complaint.title}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {new Date(complaint.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {complaint.status ? "Resolved" : "Pending"}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <Button
                        onClick={() =>
                          updateComplaintStatus(
                            complaint._id,
                            !complaint.status
                          )
                        }
                        variant="contained"
                        className="blackhover"
                        size="small"
                        sx={{ minWidth: "100px", fontSize: "12px" }}
                      >
                        {complaint.status
                          ? "Mark as Pending"
                          : "Mark as Resolved"}
                      </Button>
                      <Button
                        component={Link}
                        to={`/admin/complaints/${complaint._id}`}
                        variant="contained"
                        className="blackhover"
                        size="small"
                        sx={{ minWidth: "100px", fontSize: "12px" }}
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleOpenReplyDialog(complaint._id)}
                        variant="contained"
                        className="blackhover"
                        size="small"
                        sx={{ minWidth: "80px", fontSize: "12px" }}
                      >
                        Reply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No complaints available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openReplyDialog} onClose={handleCloseReplyDialog}>
          <DialogTitle>Reply to Complaint</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Reply"
              fullWidth
              multiline
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="blackhover"
              variant="contained"
              onClick={handleCloseReplyDialog}
            >
              Cancel
            </Button>
            <Button
              className="blackhover"
              onClick={handleSendReply}
              variant="contained"
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ComplaintsDashboard;
