import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tooltip,
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  Link,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { message } from "antd";
import Sidebar from "../../Components/Sidebars/Sidebar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AdminNavbar from "../../Components/TopNav/Adminnavbar";

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    userName: "",
  });

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:8000/admin/getpending")
      .then((response) => {
        console.log(response.data);
        if (!Array.isArray(response.data.users)) {
          console.error("Invalid response data format");
        }
        setPendingUsers(response.data.users);
      })
      .catch((error) => {
        console.error("There was an error fetching the pending users!", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (username) => {
    setLoading(true);
    axios
      .put("http://localhost:8000/admin/acceptReject", { userName: username })
      .then((response) => {
        setPendingUsers((prevUsers) =>
          prevUsers.filter((user) => user.userName !== username)
        );
        message.success(response.data.message || "User approved successfully!");
      })
      .catch((error) => {
        message.error(
          error.response?.data?.error ||
          "There was an error approving the user!"
        );
        console.error("Error approving user:", error);
      })
      .finally(() => setLoading(false));
  };

  const handleReject = (username) => {
    setLoading(true);
    axios
      .delete("http://localhost:8000/admin/acceptReject", {
        data: { userName: username },
      })
      .then((response) => {
        setPendingUsers(
          pendingUsers.filter((user) => user.userName !== username)
        );
        message.success("User rejected successfully!");
      })
      .catch((error) => {
        message.error("There was an error rejecting the user!");
        console.error("There was an error rejecting the user!", error);
      })
      .finally(() => setLoading(false));
  };

  const handleDetails = async (username) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/file/user/files/${username}`
      );

      if (response.data.length === 0) {
        message.info("No documents available for this user");
      } else {
        setUserFiles(response.data);
        setSelectedUser(username);
      }
    } catch (error) {
      message.error("Error fetching files");
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (action, userName) => {
    setConfirmDialog({ open: true, action, userName });
  };

  const handleConfirmAction = () => {
    const { action, userName } = confirmDialog;
    if (action === "approve") {
      handleApprove(userName);
    } else if (action === "reject") {
      handleReject(userName);
    }
    setConfirmDialog({ open: false, action: null, userName: "" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Full screen height
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ mt: 2 }} variant="h6" color="text.secondary">
          Loading pending users...
        </Typography>
      </Box>
    );
  }

  if ((!Array.isArray(pendingUsers)) || (pendingUsers.length === 0)) {
    return <p>No pending users available.</p>;
  }

  return (
    <Box
      sx={{
        width: "100%", // Full width of the viewport
        minHeight: "100vh", // Full height of the viewport
        background: "linear-gradient(to bottom, #fffff, #eaeaea)", // Gradient background
        paddingTop: "64px", // Adjust for navbar height
        overflow: "hidden", // Disable scroll bar
        display: "flex",
        justifyContent: "center", // Center the content horizontally
        padding: "16px",
        height: "5vh"
      }}
    >
      <Sidebar />

      <Box
        sx={{
          maxWidth: "1400px", // Increase max width for a wider layout
          width: "100%", // Full width on smaller screens
          backgroundColor: "#ffffff", // White background for the content
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
          padding: "32px", // Inner padding
          overflow: "hidden"
        }}
      >
        <AdminNavbar />
        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5", // Primary color
              textAlign: "center",
            }}
          >
            Pending Users
          </Typography>
        </Box>

        {/* Table Container */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Table shadow
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#3f51bf", // Header background
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  User Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Approve
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Reject
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Files
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.map((user, index) => (
                <TableRow
                  key={user._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "white", // Alternate row colors
                    "&:hover": {
                      backgroundColor: "#f1f1f1", // Highlight on hover
                    },
                  }}
                >
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Approve User">
                      <IconButton
                        color="success"
                        aria-label="Approve user"
                        onClick={() =>
                          openConfirmDialog("approve", user.userName)
                        }
                        disabled={loading}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Reject User">
                      <IconButton
                        color="error"
                        aria-label="Reject user"
                        onClick={() =>
                          openConfirmDialog("reject", user.userName)
                        }
                        disabled={loading}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Files">
                      <IconButton
                        color="primary"
                        onClick={() => handleDetails(user.userName)}
                        disabled={loading}
                      >
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* File List Display */}
        {selectedUser && (
          <Box
            sx={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
              Files for {selectedUser}
            </Typography>
            <List>
              {userFiles.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    padding: "8px",
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Typography sx={{ flex: 1 }}>{file.filename}</Typography>
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#3f51b5",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    View File
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Loading Spinner */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              color: "#f44336",
            }}
          >
            Confirm {confirmDialog.action === "approve" ? "Approval" : "Rejection"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to {confirmDialog.action} this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              sx={{
                backgroundColor: "#e0e0e0",
                color: "#333",
                "&:hover": { backgroundColor: "#d6d6d6" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              sx={{
                backgroundColor: confirmDialog.action === "approve" ? "#4caf50" : "#f44336",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    confirmDialog.action === "approve" ? "#388e3c" : "#d32f2f",
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>

  );
};

export default ApproveUsers;
