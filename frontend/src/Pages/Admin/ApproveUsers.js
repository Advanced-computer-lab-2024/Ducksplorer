import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, List, ListItem, Link } from '@mui/material';
import { message } from 'antd';
import Sidebar from '../../Components/Sidebars/Sidebar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userFiles, setUserFiles] = useState([]); // State to hold files of the selected user
  const [selectedUser, setSelectedUser] = useState(null); // State to hold selected user

  useEffect(() => {
    axios.get('http://localhost:8000/admin/getpending')
      .then(response => {
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
    axios.put('http://localhost:8000/admin/approveuser', { userName: username })
      .then(response => {
        setPendingUsers(pendingUsers.filter(user => user.userName !== username));
        message.success('User approved successfully!');
      })
      .catch(error => {
        message.error('There was an error approving the user!');
        console.error('There was an error approving the user!', error);
      });
  };

  const handleReject = (username) => {
    axios.put('http://localhost:8000/admin/rejectuser', { userName: username })
      .then(response => {
        setPendingUsers(pendingUsers.filter(user => user.userName !== username));
        message.success('User rejected successfully!');
      })
      .catch(error => {
        message.error('There was an error rejecting the user!');
        console.error('There was an error rejecting the user!', error);
      });
  };

  const handleDetails = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/file/user/files/${username}`);
      setUserFiles(response.data);  // Set user files to display
      setSelectedUser(username);    // Set selected user to display files for
    } catch (error) {
      message.error('Error fetching files');
      console.error(error);
    }
  };

  return (
    <>
      <Sidebar />
      <Box sx={{ p: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Pending Users</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '0 auto' }}>
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
              {pendingUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Approve User">
                      <IconButton color="success" aria-label="Approve user" onClick={() => handleApprove(user.userName)}>
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Reject User">
                      <IconButton color="error" aria-label="Reject user" onClick={() => handleReject(user.userName)}>
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Files">
                      <IconButton color="primary" onClick={() => handleDetails(user.userName)}>
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
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Files for {selectedUser}</Typography>
            <List>
              {userFiles.map((file, index) => (
                <ListItem key={index}>
                  <Typography>{file.filename}</Typography>
                  <Link href={file.url} target="_blank" rel="noopener noreferrer">
                    View File
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ApproveUsers;
