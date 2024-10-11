//This page from inside RUDMuseum
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';

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

const UpcomingMuseums = () => {
    const [upcomingMuseums, setUpcomingMuseums] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/museum/getAllUpcomingMuseums`)
            .then(response => {
                setUpcomingMuseums(response.data.upcomingMuseums);
            })
            .catch(error => {
                console.error('There was an error fetching the upcoming museum visits!', error);
                message.error('Error fetching upcoming museum visits!');
            });
    }, []);


    return (
        <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
        <Link to="/MuseumTouristPov"> Back </Link>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h4">Upcoming Museum Visits</Typography>
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
                        {upcomingMuseums.map(upcomingMuseum => (
                            <TableRow key={upcomingMuseum._id}>
                                <TableCell>{upcomingMuseum.description}</TableCell>
                                <TableCell>{upcomingMuseum.location}</TableCell>
                                <TableCell>
                                    <img
                                        src={upcomingMuseum.pictures}
                                        alt="Museum"
                                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                    />
                                </TableCell>
                                <TableCell>{upcomingMuseum.ticketPrices}</TableCell>
                                <TableCell>{upcomingMuseum.openingTime}</TableCell>
                                <TableCell>{upcomingMuseum.closingTime}</TableCell>
                                <TableCell>{upcomingMuseum.museumDate}</TableCell>
                                <TableCell>{upcomingMuseum.museumName}</TableCell>
                                <TableCell>{upcomingMuseum.museumCategory}</TableCell>
                                <TableCell>{upcomingMuseum.tags.join(', ')}</TableCell>
                                <TableCell>{upcomingMuseum.createdBy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UpcomingMuseums;
