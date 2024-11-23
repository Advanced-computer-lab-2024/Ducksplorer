import React, { useEffect, useState, createContext, useRef } from 'react';
import axios from 'axios';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import {
    Box, Table, Typography, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Rating
} from '@mui/material';
import { Link } from 'react-router-dom';

export const TagsContext = createContext();

const ItineraryReport = () => {
    const [itineraries, setItineraries] = useState([]); //holds the list of itineraries
    // const [loading, setLoading] = useState(true); //indicates if data is fetched

    const [priceExchangeRates, setPriceExchangeRates] = useState({});
    const [priceCurrency, setPriceCurrency] = useState('EGP');

    const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
    const [earningsCurrency, setEarningsCurrency] = useState('EGP');

    const [activityExchangeRates, setActivityExchangeRates] = useState({});
    const [activityCurrency, setActivityCurrency] = useState('EGP');


    //read
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        const user = JSON.parse(userJson);
        const userName = user.username;
        if (userName) {
            axios.get(`http://localhost:8000/tourGuideAccount/report/${userName}`)
                .then(response => {
                    setItineraries(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the itineraries!', error);
                });
        }
    }, []);


    async function toggleItineraryActiveStatus(itineraryId) {
        try {
            const response = await fetch(`http://localhost:8000/itinerary/toggleItineraryActiveStatus/${itineraryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle active status');
            }

            const data = await response.json();
            console.log(`New isDeactivated status after toggle: ${data.itinerary.isDeactivated}`);
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === itineraryId ? { ...itinerary, isDeactivated: !itinerary.isDeactivated } : itinerary
                )
            );
            return data.itinerary;
        } catch (error) {
            console.error('Error toggling itinerary active status:', error);

        }
    }

    const handlePriceCurrencyChange = (rates, selectedCurrency) => {
        setPriceExchangeRates(rates);
        setPriceCurrency(selectedCurrency);
    };

    const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
        setEarningsExchangeRates(rates);
        setEarningsCurrency(selectedCurrency);
    };

    const handleActivityCurrencyChange = (rates, selectedCurrency) => {
        setActivityExchangeRates(rates);
        setActivityCurrency(selectedCurrency);
    };


    return (
        <>
            <Link to="/tourGuideDashboard"> Back </Link>
            <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        Tour Guide Report
                    </Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Activities
                                    <CurrencyConvertor onCurrencyChange={handleActivityCurrencyChange} />
                                </TableCell>
                                <TableCell>Locations</TableCell>
                                <TableCell>Timeline</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Price
                                    <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                                </TableCell>
                                <TableCell>Available Dates And Times</TableCell>
                                <TableCell>Accessibility</TableCell>
                                <TableCell>Pick Up Location</TableCell>
                                <TableCell>Drop Off Location</TableCell>
                                <TableCell>Ratings</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>Flag</TableCell>
                                <TableCell>Active Status</TableCell>
                                <TableCell>Number of Bookings</TableCell>
                                <TableCell>Earnings
                                    <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itineraries.map(itinerary => itinerary.deletedItinerary === false ? (
                                <TableRow key={itinerary._id}>
                                    <TableCell>
                                        {itinerary.activity && itinerary.activity.length > 0
                                            ? itinerary.activity.map((activity, index) => (
                                                <div key={index}>
                                                    {activity.name || 'N/A'} -
                                                    Price: {(activity.price * (activityExchangeRates[activityCurrency] || 1)).toFixed(2)} {activityCurrency},<br />
                                                    Location: {activity.location || 'N/A'},<br />
                                                    Category: {activity.category || 'N/A'}
                                                    <br /><br /> {/* Adds an extra line break between activities */}
                                                </div>
                                            ))
                                            : 'No activities available'}
                                    </TableCell>

                                    <TableCell>
                                        {itinerary.locations && itinerary.locations.length > 0 ? (
                                            itinerary.locations.map((location, index) => (
                                                <div key={index}>
                                                    <Typography variant="body1">
                                                        {index + 1}: {location.trim()}
                                                    </Typography>
                                                    <br />
                                                </div>
                                            ))
                                        ) : 'No locations available'}
                                    </TableCell>

                                    <TableCell>{itinerary.timeline}</TableCell>
                                    <TableCell>{itinerary.language}</TableCell>
                                    <TableCell>
                                        {(itinerary.price * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                                    </TableCell>
                                    <TableCell>
                                        {itinerary.availableDatesAndTimes.length > 0
                                            ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                                                const dateObj = new Date(dateTime);
                                                const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
                                                const time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
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
                                    <TableCell><Rating
                                        value={itinerary.averageRating}
                                        precision={0.1}
                                        readOnly
                                    /></TableCell>

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
                                        {itinerary.isDeactivated ? 'Activate' : 'Deactivate'}
                                    </TableCell>
                                    <TableCell>{itinerary.bookedCount}</TableCell>
                                    <TableCell>
                                        {((itinerary.bookedCount * itinerary.price * 0.9) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
                                    </TableCell>
                                </TableRow>
                            ) : null) //We don't output a row when the itinerary has been deleted but cannot be removed from the database since it is booked by previous tourists
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box >
        </>
    );
}

export default ItineraryReport;