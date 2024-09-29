import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { message } from 'antd';


const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/admin/getpending')
      .then(response => {
        console.log(response.data);
        if (!Array.isArray(response.data.users)) {
          console.error('Invalid response data format');
        }
        setPendingUsers(response.data.users);
      })
      .catch(error => {
        console.error('There was an error fetching the pending users!', error);
      });
  }, []);

  const handleApprove = (username) => {
    axios.put('http://localhost:8000/admin/approveuser', { userName:username })
      .then(response => {
        setPendingUsers(pendingUsers.filter(user => user.userName !== username));
        message.success('User approved successfully!');
      })
      .catch(error => {
        message.error('There was an error approving the user!');
        console.error('There was an error approving the user!', error);
      });
  };

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4">
          Pending Users
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '0 auto' }}>
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
            {pendingUsers.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleApprove(user.userName)}>
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApproveUsers;