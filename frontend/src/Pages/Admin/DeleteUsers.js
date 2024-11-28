import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
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
      height: "100vh",
      backgroundColor: "#f5f5f5",
      paddingTop: "64px", // Adjusted for fixed navbar spacing
    }}
  >      <Sidebar />
      <Box
        sx={{
          p: 6,
          height: "500px",
          transform: "translateX(170px) translateY(-50px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Active Users</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton
                        color="error"
                        aria-label="delete category"
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
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DeleteUser;
