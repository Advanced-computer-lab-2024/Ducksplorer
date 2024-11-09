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
import Help from "../../Components/HelpIcon";

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
      });
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

  return (
    <>
      <Sidebar />
      <Box sx={{ p: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Pending Users</Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", margin: "0 auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approve</TableCell>
                <TableCell>Reject</TableCell>
                <TableCell>Files</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user._id}>
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
        <Help />

        {/* File List Display */}
        {selectedUser && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Files for {selectedUser}</Typography>
            <List>
              {userFiles.map((file, index) => (
                <ListItem key={index}>
                  <Typography>{file.filename}</Typography>
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Loading Spinner */}
        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        >
          <DialogTitle>{`Confirm ${
            confirmDialog.action === "approve" ? "Approval" : "Rejection"
          }`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to {confirmDialog.action} this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setConfirmDialog({ ...confirmDialog, open: false })
              }
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ApproveUsers;
