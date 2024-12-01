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
import Sidebar from '../../Components/Sidebars/Sidebar';

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
    height: "100vh",
    backgroundColor: "#ffffff", // Light background color
    overflow: "visible", // Prevent scrollbars
    display: "flex", // Flex layout for Navbar and Sidebar
    flexDirection: "column",
    
  }}
>
  {/* Navbar */}
  <AdminNavbar />

  {/* Sidebar and Content */}
  <Box
    sx={{
      display: "flex",
      width: "100%",
      height: "100%",
    }}
>
<Sidebar/>
    {/* Main Content */}
    <Box
      sx={{
        flex: 1,
        padding: "32px",
        backgroundColor: "#ffffff", // White background for main content
        borderRadius: "12px", // Rounded corners
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        margin: "auto", // Center the content
        maxWidth: "1200px", // Responsive width
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#3f51b5", // Primary color
          textAlign: "center",
          marginBottom: "24px", // Space below the title
        }}
      >
        Available Activities
      </Typography>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
          overflow: "hidden", // Prevent overflow
          
          
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#3f51b5", // Header background color
            }}
          >
            <TableRow>
              {[
                "Name",
                "Price",
                "Is Open",
                "Category",
                "Tags",
                "Discount",
                "Date",
                "Duration",
                "Location",
                "Rating",
                "Flag",
                "Action",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow
                  key={activity._id}
                  sx={{
                    backgroundColor: activity.flag ? "#ffdddd" : "transparent", // Highlight flagged rows
                    "&:hover": {
                      backgroundColor: "#f1f1f1", // Highlight on hover
                      
                    },
                  }}
                >
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
                    <Rating value={activity.averageRating} precision={0.1} readOnly />
                  </TableCell>
                  <TableCell>
                    {activity.flag ? (
                      <Typography
                        sx={{ display: "flex", alignItems: "center", color: "red" }}
                      >
                        <WarningIcon sx={{ marginRight: "4px" }} />
                        Inappropriate
                      </Typography>
                    ) : (
                      <Typography
                        sx={{ display: "flex", alignItems: "center", color: "green" }}
                      >
                        <CheckCircleIcon sx={{ marginRight: "4px" }} />
                        Appropriate
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12}>
                  <Typography variant="body2" align="center">
                    No Activities Found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Box>
</Box>

  );
}

export default ViewAllActivities;


