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
} from "@mui/material";
import { message } from "antd";
import Sidebar from "../../Components/Sidebars/Sidebar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Help from "../../Components/HelpIcon";

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

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
    axios
      .put("http://localhost:8000/admin/approveuser", { userName: username })
      .then((response) => {
        setPendingUsers(
          pendingUsers.filter((user) => user.userName !== username)
        );
        message.success("User approved successfully!");
      })
      .catch((error) => {
        message.error("There was an error approving the user!");
        console.error("There was an error approving the user!", error);
      });
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
                <TableCell>Actions</TableCell>
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
                        onClick={() => handleApprove(user.userName)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Help />
      </Box>
    </>
  );
};

export default ApproveUsers;
