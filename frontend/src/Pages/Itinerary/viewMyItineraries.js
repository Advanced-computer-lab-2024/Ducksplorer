import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
// import AddIcon from '@mui/icons-material/Add';
import { TextField, IconButton, Box, Button, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';

const MyItineraries = () => {
    const [itineraries, setItineraries] = useState([]);

    //read
    useEffect(() => {
        axios.get('http://localhost:8000/itinerary/myItineraries')
            .then(response => {
                setItineraries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching my itineraries!', error);
            });
    }, []);


    return (
        <>
            <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        Available itineraries
                    </Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Activities</TableCell>
                                <TableCell>Locations</TableCell>
                                <TableCell>Timeline</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Available Dates And Times</TableCell>
                                <TableCell>Accessibility</TableCell>
                                <TableCell>Pick Up Location</TableCell>
                                <TableCell>Drop Off Location</TableCell>
                                <TableCell>Ratings</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itineraries.map(itinerary => (
                                <TableRow key={itinerary._id}>
                                    <TableCell>
                                        {itinerary.activity && itinerary.activity.length > 0
                                            ? itinerary.activity.map((activity, index) => (
                                                <div key={index}>
                                                    {activity.name || 'N/A'}- Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                                                    Location: {activity.location || 'N/A'},<br />
                                                    Category: {activity.category || 'N/A'}
                                                    <br /><br /> {/* Adds an extra line break between activities */}
                                                </div>
                                            ))
                                            : 'No activities available'}
                                    </TableCell>

                                    <TableCell>{itinerary.locations}</TableCell>
                                    <TableCell>{itinerary.timeline}</TableCell>
                                    <TableCell>{itinerary.language}</TableCell>
                                    <TableCell>{itinerary.price}</TableCell>
                                    <TableCell>
                                        {itinerary.availableDatesAndTimes.length > 0
                                            ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                                                const dateObj = new Date(dateTime); // Create a Date object from the string
                                                const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
                                                const time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
                                                return (
                                                    <div key={index}>
                                                        Date {index + 1}: {date}<br />
                                                        Time {index + 1}: {time}                          </div>
                                                );
                                            })
                                            : 'No available dates and times'}
                                    </TableCell>
                                    <TableCell>{itinerary.accessibility}</TableCell>
                                    <TableCell>{itinerary.pickUpLocation}</TableCell>
                                    <TableCell>{itinerary.dropOffLocation}</TableCell>
                                    <TableCell>{itinerary.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

export default MyItineraries;