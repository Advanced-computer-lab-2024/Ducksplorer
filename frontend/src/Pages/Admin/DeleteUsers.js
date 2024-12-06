import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import AdminNavbar from "../../Components/TopNav/Adminnavbar";
import {
  Box,
  Button,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import Sidebar from "../../Components/Sidebars/Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/")
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const handleDelete = (username) => {
    fetch("http://localhost:8000/admin/deleteuser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: username }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        message.success("User deleted successfully!");
        setUsers(users.filter((user) => user.userName !== username));
      })
      .catch((error) => {
        console.log(username);
        message.error("There was an error deleting the user!");
        console.error("There was an error deleting the user!", error);
      });
  };

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      handleDelete(selectedUser);
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        height: "auto",
        paddingTop: "64px",
        width: "120vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* Navbar */}
      <AdminNavbar />
      <Sidebar />

      {/* Main Content */}
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "10%" }}
      >
        <div style={{ overflowY: "visible", height: "auto" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom
          >
            Active Users
          </Typography>
          <br></br>

          {/* Table Container */}
          <TableContainer
            component={Paper}
            sx={{
              width: "80vw",
              borderRadius: "12px", // Rounded corners
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
              overflow: "hidden", // Ensure no scroll bars
            }}
          >
              <Table>
                <TableHead>
                  <TableRow sx={{
                  }}>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      User Name
                    </TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user._id}

                    >
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            aria-label="delete user"
                            onClick={() => handleClickOpen(user.userName)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiDialog-paper": {
                  borderRadius: "16px", // Rounded corners
                  padding: "16px", // Inner padding
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#f44336", // Red for emphasis
                }}
              >
                Confirm Deletion
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this account?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "#e0e0e0", // Subtle gray
                    color: "#333",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#d6d6d6" }, // Lighter hover effect
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  sx={{
                    backgroundColor: "#f44336", // Red for delete
                    color: "white",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#d32f2f" }, // Darker hover effect
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        </div>
      </div>
    </Box>
  );
}


export default DeleteUser;
