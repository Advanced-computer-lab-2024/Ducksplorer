// UpcomingHistoricalPlaces.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

import {
    Box,
    Table,
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const UpcomingHistoricalPlaces = () => {
    const [upcomingHistoricalPlaces, setUpcomingHistoricalPlaces] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/historicalPlace/getAllUpcomingHistoricalPlaces`)
            .then(response => {
                setUpcomingHistoricalPlaces(response.data.upcomingHistoricalPlaces);
            })
            .catch(error => {
                console.error('There was an error fetching the upcoming historical place visits!', error);
                message.error('Error fetching upcoming historical place visits!');
            });
    }, []);


    return (
        <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h4">Upcoming Historical Place Visits</Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Pictures</TableCell>
                            <TableCell>Ticket Price</TableCell>
                            <TableCell>Opening Time</TableCell>
                            <TableCell>Closing Time</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Created By</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {upcomingHistoricalPlaces.map(upcomingHistoricalPlace => (
                            <TableRow key={upcomingHistoricalPlace._id}>
                                <TableCell>{upcomingHistoricalPlace.description}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.location}</TableCell>
                                <TableCell>
                                    <img
                                        src={upcomingHistoricalPlace.pictures}
                                        alt="Historical Place"
                                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                    />
                                </TableCell>
                                <TableCell>{upcomingHistoricalPlace.ticketPrices}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.openingTime}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.closingTime}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.HistoricalPlaceDate}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.HistoricalPlaceName}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.HistoricalPlaceCategory}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.tags.join(', ')}</TableCell>
                                <TableCell>{upcomingHistoricalPlace.createdBy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UpcomingHistoricalPlaces;
