import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TouristNavBar from '../../Components/TouristNavBar';
import TouristSidebar from '../../Components/Sidebars/TouristSidebar';
import AdminNavbar from '../../Components/TopNav/Adminnavbar';
import Sidebar from '../../Components/Sidebars/Sidebar';
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


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflowY: "auto",
        display: "flex", // Flex layout for Navbar and Sidebar
        height: "10vh"
      }}
    >
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1, // Take the remaining width
          padding: "32px", // Inner padding
          maxWidth: "1200px", // Content width limit
          margin: "0 auto", // Center content horizontally
          backgroundColor: "#ffffff", // White background for main content
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
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
          Itineraries
        </Typography>

        {/* Table Container */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px", // Rounded corners
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            overflow: "hidden", // Prevent content overflow
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
              {itineraries.length > 0 ? (
                itineraries.map((itinerary) => (
                  <TableRow
                    key={itinerary._id}
                    sx={{
                      backgroundColor: itinerary.flag ? "#ffdddd" : "transparent", // Highlight flagged rows
                      "&:hover": {
                        backgroundColor: "#f1f1f1", // Highlight on hover
                      },
                    }}
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
      </Box>
    </Box>


  );
}

export default ViewAllItineraries;


