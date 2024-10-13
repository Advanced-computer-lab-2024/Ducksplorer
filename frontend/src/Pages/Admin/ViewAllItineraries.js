import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
                console.error('Error changing the flag of itinerary!', error);
                message.error(`Error changing the flag of itinerary: ${error.response ? error.response.data.message : error.message}`);
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
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', flexDirection: 'column', overflowY: 'visible', height: '100vh' }}>
            <Link to="/AdminDashboard"> Back </Link>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Available itineraries
                </Typography>
            </Box>

            <div style={{ flex: 1 }}>
                {itineraries.length > 0 ? (
                    <Box >
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Activities</TableCell>
                                        <TableCell>Locations</TableCell>
                                        <TableCell>Timeline</TableCell>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Available Dates and Times</TableCell>
                                        <TableCell>Accessibility</TableCell>
                                        <TableCell>Pick Up Location</TableCell>
                                        <TableCell>Drop Off Location</TableCell>
                                        <TableCell>Ratings</TableCell>
                                        <TableCell>Tags</TableCell>
                                        <TableCell>Flag</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itineraries.map(itinerary => (
                                        <TableRow key={itinerary._id}
                                            style={{ backgroundColor: itinerary.flag ? '#ffdddd' : 'transparent' }} // Change background for flagged itineraries
                                        >
                                            <TableCell>
                                                {itinerary.activity && itinerary.activity.length > 0
                                                    ? itinerary.activity.map((activity, index) => (
                                                        <div key={index}>
                                                            {activity.name || 'N/A'} - Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                                                            Location: {activity.location || 'N/A'},<br />
                                                            Category: {activity.category || 'N/A'}
                                                            <br /><br />
                                                        </div>
                                                    ))
                                                    : 'No activities available'}
                                            </TableCell>
                                            <TableCell>
                                                {itinerary.locations && itinerary.locations.length > 0 ? (
                                                    itinerary.locations.map((location, index) => (
                                                        <div key={index}>
                                                            <Typography variant="body1">
                                                                Location {index + 1}: {location.trim()}
                                                            </Typography>
                                                            <br />
                                                        </div>
                                                    ))
                                                ) : 'No locations available'}
                                            </TableCell>
                                            <TableCell>{itinerary.timeline}</TableCell>
                                            <TableCell>{itinerary.language}</TableCell>
                                            <TableCell>{itinerary.price}</TableCell>
                                            <TableCell>
                                                {itinerary.availableDatesAndTimes.length > 0
                                                    ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                                                        const dateObj = new Date(dateTime);
                                                        const date = dateObj.toISOString().split('T')[0];
                                                        const time = dateObj.toTimeString().split(' ')[0];
                                                        return (
                                                            <div key={index}>
                                                                Date {index + 1}: {date}<br />
                                                                Time {index + 1}: {time}
                                                            </div>
                                                        );
                                                    })
                                                    : 'No available dates and times'}
                                            </TableCell>
                                            <TableCell>{itinerary.accessibility}</TableCell>
                                            <TableCell>{itinerary.pickUpLocation}</TableCell>
                                            <TableCell>{itinerary.dropOffLocation}</TableCell>
                                            <TableCell>{itinerary.rating}</TableCell>
                                            <TableCell>
                                                {itinerary.tags && itinerary.tags.length > 0
                                                    ? itinerary.tags.map((tag, index) => (
                                                        <div key={index}>
                                                            {tag || 'N/A'}
                                                            <br /><br />
                                                        </div>
                                                    ))
                                                    : 'No tags available'}
                                            </TableCell>

                                            <TableCell>
                                                {itinerary.flag ? (
                                                    <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                                        <WarningIcon style={{ marginRight: '4px' }} />
                                                        Inappropriate
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                                                        <CheckCircleIcon style={{ marginRight: '4px' }} />
                                                        Appropriate
                                                    </span>
                                                )}
                                            </TableCell>
                                            
                                            <TableCell>
                                                <Tooltip title="Set Itinerary as Inappropriate">
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
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        No itineraries found.
                    </Typography>
                )}
            </div>
        </Box>
    );
}

export default ViewAllItineraries;


