import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';
import AdminNavbar from '../../Components/TopNav/Adminnavbar';
import TouristNavBar from '../../Components/TouristNavBar';
import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Rating
} from '@mui/material';

const ViewAllActivities = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null); // Stores the currently selected activity for editing

  // Default rendering of all activities
  useEffect(() => {
    axios.get('http://localhost:8000/activity/')
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the activities!', error);
      });
  }, []);



  const handleSetFlag = (activityId, newFlagState) => {
    axios.put(`http://localhost:8000/activity/toggleFlagActivity/${activityId}`, { flag: newFlagState })
      .then(response => {
        const action = newFlagState ? 'Set as inappropriate' : 'Set as appropriate';
        message.success(`Activity ${action}!`);
      })
      .catch(error => {
        console.error('Error changing the flag of activity!', error);
        message.error(`Error changing the flag of activity: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  //Responsible for changing the state locally
  const flagActivity = (activity) => {
    // Determine the new flag state
    const newFlagState = !activity.flag;

    const updatedActivities = activities.map((item) =>
      item._id === activity._id ? { ...item, flag: newFlagState } : item
    );
    setActivities(updatedActivities);
    handleSetFlag(activity._id, newFlagState);
  };


  return (
    <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      paddingTop: "64px", // Adjust for navbar height
      overflowY: "auto",
    }}
  >
    {/* Navbar */}
    <AdminNavbar />   
    <Box
    sx={{
      height: "100vh",
      backgroundColor: "#f9f9f9",
      paddingTop: "64px", // Adjust for navbar height
    }}
  >
    <TouristNavBar />
    <TouristSidebar/>
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', flexDirection: 'column', overflowY: 'visible', height: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4">
          Available activities
        </Typography>
      </Box>

      <div style={{ flex: 1 }}>
        {activities.length > 0 ? (
          <Box >
            <TableContainer component={Paper} style={{ borderRadius: 20 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Is Open</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>

                </TableHead>

                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity._id}
                      style={{ backgroundColor: activity.flag ? '#ffdddd' : 'transparent' }}> {/* Change background for flagged activities */}

                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.price}</TableCell>
                      <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell>{activity.tags.join(", ")}</TableCell>
                      <TableCell>{activity.specialDiscount}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell>{activity.duration}</TableCell>
                      <TableCell>{activity.location}</TableCell>
                      <TableCell>
                        {/* Display Rating on one line */}
                        <Rating value={activity.averageRating} precision={0.1} readOnly />
                      </TableCell>

                      <TableCell>
                        {/* Display Flag status in a separate line */}
                        {activity.flag ? (
                          <span style={{ color: 'red', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <WarningIcon style={{ marginRight: '4px' }} />
                            Inappropriate
                          </span>
                        ) : (
                          <span style={{ color: 'green', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <CheckCircleIcon style={{ marginRight: '4px' }} />
                            Appropriate
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {/* Display Flag icon on a separate line */}
                        <Tooltip title="Change Activity Flag">
                          <IconButton
                            color="error"
                            aria-label="Flag Activity"
                            onClick={() => {
                              setEditingActivity(activity); // Set the activity to be flagged
                              flagActivity(activity); // Update the activity immediately
                            }}
                          >
                            <FlagIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" style={{ marginTop: '20px' }}>
            No Activities found.
          </Typography>
        )}
      </div>
    </Box>
    </Box>
    </Box>
  );
}

export default ViewAllActivities;


