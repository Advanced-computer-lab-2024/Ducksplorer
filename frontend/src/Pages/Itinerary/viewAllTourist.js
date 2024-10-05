import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Button, Stack, TextField, Typography, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function SearchItineraries() {
    const [searchTerm, setSearchTerm] = useState(''); // Single search term
    const [itineraries, setItineraries] = useState([]);

    const handleSearchItineraries = async () => {
        try {
            const response = await axios.get('http://localhost:8000/itinerary/search', {
                params: {
                    searchTerm 
                },
            });

            if (response.status === 200) {
                message.success('Itineraries viewed successfully');
                setItineraries(response.data); 
            } else {
                message.error('Failed to search itineraries');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h2>Search Itineraries</h2>
            <Stack spacing={2} style={{ marginBottom: '20px' }}>
                <TextField
                    label="Enter Name or Category"
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchItineraries}
                >
                    Search
                </Button>
            </Stack>

            <div style={{ flex: 1, overflowY: 'auto' }}> 
                {itineraries.length > 0 ? (
                    <Box>
                        <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'scroll' }}> {/* Limit table height and make it scroll */}
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itineraries.map(itinerary => (
                                        <TableRow key={itinerary._id}>
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
                                            <TableCell>{itinerary.locations}</TableCell>
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
        </div>
    );
}

export default SearchItineraries;
