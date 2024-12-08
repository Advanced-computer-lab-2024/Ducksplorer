import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import FlagIcon from "@mui/icons-material/Flag";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AdminNavbar from "../../Components/NavBars/AdminNavBar";
import NavigationTabs from "../../Components/NavigationTabs";
import { useNavigate } from "react-router-dom";

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
  Rating,
} from "@mui/material";

const ViewAllActivities = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null); // Stores the currently selected activity for editing
  const [selectedTab, setSelectedTab] = useState("Activities");
  const navigate = useNavigate();
  const tabs = [
    "Activities",
    "Itineraries",
  ];
  const paths = ["/ViewAllActivities", "/ViewAllItineraries"];

  // Default rendering of all activities
  useEffect(() => {
    if (selectedTab === "Activities") {
      axios
        .get("http://localhost:8000/activity/")
        .then((response) => {
          setActivities(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the activities!", error);
        });
    }
  }, [selectedTab]);

  const handleSetFlag = (activityId, newFlagState) => {
    axios
      .put(`http://localhost:8000/activity/toggleFlagActivity/${activityId}`, {
        flag: newFlagState,
      })
      .then((response) => {
        const action = newFlagState
          ? "Set as inappropriate"
          : "Set as appropriate";
        message.success(`Activity ${action}!`);
      })
      .catch((error) => {
        console.error("Error changing the flag of activity!", error);
        message.error(
          `Error changing the flag of activity: ${error.response ? error.response.data.message : error.message
          }`
        );
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
        paddingTop: "64px",
        width: "90vw",
        marginLeft: "5vw",
      }}
    >
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1, // Take the remaining width
          padding: "32px", // Inner padding
          margin: "0 auto", // Center content horizontally
          borderRadius: "12px", // Rounded corners
        }}
      >
        {/* Page Title */}
        <div
          style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
        >
          <div style={{ overflowY: "visible", height: "100vh" }}>
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bold" }}
              gutterBottom
            >
              Events
            </Typography>
            <br></br>
            <div>
              <NavigationTabs tabNames={tabs} paths={paths} />
            </div>
            {selectedTab === "Activities" && (
              <TableContainer
                component={Paper}
                sx={{
                  marginBottom: 4,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  borderRadius: "1.5cap",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Price</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Is Open</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Category</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Tags</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Discount</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Duration</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Location</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Rating</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Flag</TableCell>
                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} style={{ textAlign: "center" }}>
                          <Typography variant="body1" style={{ marginTop: "20px" }}>
                            No Activities found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity) => (
                        <TableRow
                          key={activity._id}
                          style={{
                            backgroundColor: activity.flag
                              ? "#ffdddd"
                              : "transparent",
                          }}
                        >
                          <TableCell>{activity.name}</TableCell>
                          <TableCell>{activity.price}</TableCell>
                          <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                          <TableCell>{activity.category}</TableCell>
                          <TableCell>{activity.tags.join(", ")}</TableCell>
                          <TableCell>{activity.specialDiscount}</TableCell>
                          <TableCell>
                            {new Date(activity.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{activity.duration}</TableCell>
                          <TableCell>{activity.location}</TableCell>
                          <TableCell>
                            <Rating
                              value={activity.averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            {activity.flag ? (
                              <span
                                style={{
                                  color: "red",
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <WarningIcon style={{ marginRight: "4px" }} />
                                Inappropriate
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "green",
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <CheckCircleIcon style={{ marginRight: "4px" }} />
                                Appropriate
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Change Activity Flag">
                              <IconButton
                                color="error"
                                aria-label="Flag Activity"
                                onClick={() => {
                                  setEditingActivity(activity);
                                  flagActivity(activity);
                                }}
                              >
                                <FlagIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ViewAllActivities;
