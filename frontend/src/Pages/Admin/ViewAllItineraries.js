import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminNavbar from "../../Components/NavBars/AdminNavBar";
import { useNavigate } from "react-router-dom";
import MyChips from "../../Components/MyChips";

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
  Tooltip
} from '@mui/material';

const ViewAllItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [editingItinerary, setEditingItinerary] = useState(null); // Stores the currently selected itinerary for editing
  const [selectedCategory, setSelectedCategory] = useState("Itineraries");
  const navigate = useNavigate();
  const chipNames = [
    "Activities",
    "Itineraries",
  ];

  // Default rendering of all itineraries
  useEffect(() => {
    axios.get('http://localhost:8000/itinerary/')
      .then(response => {
        setItineraries(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the itineraries!', error);
      });
  }, []);

  const handleSetFlag = (itineraryId, newFlagState) => {
    axios.put(`http://localhost:8000/itinerary/toggleFlagItinerary/${itineraryId}`, { flag: newFlagState })
      .then(response => {
        const action = newFlagState ? 'Set as inappropriate' : 'Set as appropriate';
        message.success(`Itinerary ${action}!`);
      })
      .catch(error => {
        console.error('Error changing the flag of itinerary!', error.response ? error.response.data : error.message);
        message.error(`Error changing the flag of itinerary: ${error.response ? error.response.data : error.message}`);
      });
  };

  //Responsible for changing the state locally
  const flagItinerary = (itinerary) => {
    // Determine the new flag state
    const newFlagState = !itinerary.flag;

    const updatedItineraries = itineraries.map((item) =>
      item._id === itinerary._id ? { ...item, flag: newFlagState } : item
    );
    setItineraries(updatedItineraries);
    // It creates a new array called updatedItineraries by mapping over the existing itineraries array.
    // For each item in the itineraries array, it checks if the item._id matches the itinerary._id of the itinerary being flagged:
    // If it matches, it creates a new object for that itinerary, spreading the existing properties of item ({ ...item }) and setting flag: true to indicate that the itinerary has been flagged.
    // If it does not match, it simply returns the item unchanged.
    // After mapping, updatedItineraries will contain the modified array with the flagged itinerary.
    // then it sends to handleSetFlag so that this change is on the server

    handleSetFlag(itinerary._id, newFlagState);
  };

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);

    // Navigate or update view based on selected category
    if (chipName === "Activities") {
      navigate("/ViewAllActivities"); // 
    }
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
            <MyChips chipNames={chipNames} onChipClick={handleChipClick} />
            <br></br>
            {/* Table Container */}
            {selectedCategory === "Itineraries" && (
              <TableContainer
                component={Paper}
                sx={{
                  marginBottom: 4,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  borderRadius: "1.5cap",
                }}
              >
                <Table>
                  <TableHead
                  >
                    <TableRow>
                      {[
                        "Activities",
                        "Locations",
                        "Timeline",
                        "Language",
                        "Price",
                        "Available Dates and Times",
                        "Accessibility",
                        "Pick Up Location",
                        "Drop Off Location",
                        "Ratings",
                        "Tags",
                        "Flag",
                        "Action",
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{ fontSize: "18px", fontWeight: "bold" }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itineraries.length > 0 ? (
                      itineraries.map((itinerary) => (
                        <TableRow
                          key={itinerary._id}
                        >
                          {/* Activities */}
                          <TableCell>
                            {itinerary.activity?.length > 0 ? (
                              itinerary.activity.map((activity, index) => (
                                <Box key={index} sx={{ marginBottom: "8px" }}>
                                  <Typography variant="body2">
                                    <strong>Name:</strong> {activity.name || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Price:</strong> {activity.price || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Location:</strong> {activity.location || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Category:</strong> {activity.category || "N/A"}
                                  </Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2">No activities available</Typography>
                            )}
                          </TableCell>

                          {/* Other Columns */}
                          <TableCell>
                            {itinerary.locations?.length > 0 ? (
                              itinerary.locations.map((location, index) => (
                                <Typography key={index} variant="body2">
                                  {location.trim()}
                                </Typography>
                              ))
                            ) : (
                              "No locations available"
                            )}
                          </TableCell>
                          <TableCell>{itinerary.timeline || "N/A"}</TableCell>
                          <TableCell>{itinerary.language || "N/A"}</TableCell>
                          <TableCell>{itinerary.price || "N/A"}</TableCell>
                          <TableCell>
                            {itinerary.availableDatesAndTimes?.length > 0
                              ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                                const dateObj = new Date(dateTime);
                                const date = dateObj.toISOString().split("T")[0];
                                const time = dateObj.toTimeString().split(" ")[0];
                                return (
                                  <Typography key={index} variant="body2">
                                    {date} {time}
                                  </Typography>
                                );
                              })
                              : "No available dates and times"}
                          </TableCell>
                          <TableCell>{itinerary.accessibility || "N/A"}</TableCell>
                          <TableCell>{itinerary.pickUpLocation || "N/A"}</TableCell>
                          <TableCell>{itinerary.dropOffLocation || "N/A"}</TableCell>
                          <TableCell>{itinerary.rating || "N/A"}</TableCell>
                          <TableCell>
                            {itinerary.tags?.length > 0
                              ? itinerary.tags.map((tag, index) => (
                                <Typography key={index} variant="body2">
                                  {tag}
                                </Typography>
                              ))
                              : "No tags available"}
                          </TableCell>
                          <TableCell>
                            {itinerary.flag ? (
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
                            <Tooltip title="Change Itinerary Flag">
                              <IconButton
                                color="error"
                                aria-label="Flag Itinerary"
                                onClick={() => {
                                  setEditingItinerary(itinerary); // Set the itinerary to be flagged
                                  flagItinerary(itinerary); // Update the itinerary immediately
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
                        <TableCell colSpan={13}>
                          <Typography variant="body2" align="center">
                            No itineraries found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </Box>
    </Box >

  );
}

export default ViewAllItineraries;


