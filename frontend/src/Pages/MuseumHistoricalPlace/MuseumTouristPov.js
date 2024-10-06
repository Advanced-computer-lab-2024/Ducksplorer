import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    Table,
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const MuseumTouristPov = () => {
    const [museums, setMuseums] = useState([]);
    const navigate = useNavigate();


    // Fetch visits on component mount
    useEffect(() => {

        axios.get(`http://localhost:8000/museum/getAllMuseums`)
            .then(response => {
                setMuseums(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the museums!', error);
                message.error('Error fetching museums!');
            });
    }, []);

    // Navigate to the upcoming historical places page
    const goToUpcomingPage = () => {
        navigate('/UpcomingMuseums');
    };

    return (
        <>
            <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h4">Available Museum Visits</Typography>
                </Box>

                {/* Button to navigate to upcoming historical places */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
                        Get Upcoming Museum Visits
                    </Button>
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
                            {museums.map(museum => (
                                <TableRow key={museum._id}>
                                    <TableCell>{museum.description}</TableCell>
                                    <TableCell>{museum.location}</TableCell>
                                    <TableCell>
                                        <img
                                            src={museum.pictures}
                                            alt="Museum"
                                            style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                                        />
                                    </TableCell>
                                    <TableCell>{museum.ticketPrices}</TableCell>
                                    <TableCell>{museum.openingTime}</TableCell>
                                    <TableCell>{museum.closingTime}</TableCell>
                                    <TableCell>{museum.museumDate}</TableCell>
                                    <TableCell>{museum.museumName}</TableCell>
                                    <TableCell>{museum.museumCategory}</TableCell>
                                    <TableCell>{museum.tags.join(', ')}</TableCell>
                                    <TableCell>{museum.createdBy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default MuseumTouristPov;
