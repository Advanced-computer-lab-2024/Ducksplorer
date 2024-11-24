import React, { useEffect, useState, createContext, useRef } from 'react';
import axios from 'axios';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Menu,
    MenuItem,
    IconButton,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Rating,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export const TagsContext = createContext();

const ItineraryReport = () => {
    const [itineraries, setItineraries] = useState([]); //holds the list of itineraries
    const [loading, setLoading] = useState(true); //indicates if data is fetched

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");  // State for error message

    const [filterType, setFilterType] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);


    const [priceExchangeRates, setPriceExchangeRates] = useState({});
    const [priceCurrency, setPriceCurrency] = useState('EGP');

    const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
    const [earningsCurrency, setEarningsCurrency] = useState('EGP');

    const [activityExchangeRates, setActivityExchangeRates] = useState({});
    const [activityCurrency, setActivityCurrency] = useState('EGP');

    const userName = JSON.parse(localStorage.getItem("user")).username;

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

    //Filtering handlers
    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    //clear all filters
    const handleClearAllFilters = () => {
        setDate("");
        setMonth("");
        setYear("");
        setSelectedFilters([]);

        axios.get
            `http://localhost:8000/tourGuideAccount/report/${userName}`
            .then((response) => {
                setItineraries(response.data);
            })
            .catch((error) => {
                message.error("There was an error fetching the itineraries!", error);
            });

        handleFilterClose();
    };

    useEffect(() => {
        if (!filtersApplied) return; // Do nothing if filters are not applied

        const fetchFilteredActivities = async () => {
            setLoading(true);
            setErrorMessage(""); // Reset error message before fetching

            try {
                let queryString = '';

                // Apply date filter if selected
                if (date) {
                    queryString += `date=${date}&`;
                }

                // Apply month and year filters only if selected
                else if (month) {
                    queryString += `month=${month}&`;
                }

                if (year) {
                    queryString += `year=${year}&`;
                }

                // Remove the trailing '&' if it exists
                queryString = queryString.endsWith('&') ? queryString.slice(0, -1) : queryString;

                // Fetch activities with the constructed query string
                const response = await axios.get(`http://localhost:8000/tourGuideAccount/filterItReport?${queryString}`);

                setItineraries(response.data);

                if (response.data.length === 0) {
                    setErrorMessage("No itineraries found for the selected filters.");
                }
            } catch (error) {
                setErrorMessage("Error fetching itineraries!");
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredActivities(); // Trigger the fetching when the effect runs
    }, [filtersApplied, date, month, year]); // Re-run the effect if any of the filters change or filters are applied

    const handleApplyFilters = () => {
        // Assuming `setFiltersApplied` is a state setter for the `filtersApplied` variable
        setFiltersApplied(true);
    };

    const generateYearOptions = () => {
        const startYear = 2030;
        const numOptions = 50; // Limit to 50 options
        return Array.from({ length: numOptions }, (_, i) => startYear - i).filter((year) => year >= 0);
    };


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
                        Sales Tour Guide Report
                    </Typography>
                </Box>

                {/* Filtering */}
                <IconButton onClick={handleFilterChoiceClick}>
                    <FilterAltIcon />
                </IconButton>
                <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                >
                    {/* Radio Buttons for Filter Selection */}
                    <MenuItem>
                        <FormControl>
                            <RadioGroup
                                value={filterType} // This should be managed in state
                                onChange={(e) => {
                                    setFilterType(e.target.value); // Update the selected filter type
                                    setDate(""); // Clear previous values
                                    setMonth("");
                                    setYear("");
                                }}
                            >
                                {/* Date Filter */}
                                <FormControlLabel
                                    value="date"
                                    control={<Radio />}
                                    label="Choose a Date"
                                />
                                {filterType === "date" && (
                                    <TextField
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        style={{ marginTop: "10px", width: "100%" }}
                                    />
                                )}

                                {/* Month and/or Year Filter */}
                                <FormControlLabel
                                    value="monthYear"
                                    control={<Radio />}
                                    label="Choose Month/Year"
                                />
                                {filterType === "monthYear" && (
                                    <div>
                                        {/* Month Dropdown */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Month</InputLabel>
                                                <Select
                                                    value={month}
                                                    onChange={(e) => {
                                                        setMonth(e.target.value);
                                                        setDate(""); // Reset date if month is selected
                                                    }}
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <MenuItem key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {/* Year Dropdown */}
                                            <FormControl fullWidth>
                                                <InputLabel>Year</InputLabel>
                                                <Select
                                                    value={year}
                                                    onChange={(e) => {
                                                        setYear(e.target.value);
                                                        setDate(""); // Reset date if year is selected
                                                    }}
                                                >
                                                    {generateYearOptions().map((yr) => (
                                                        <MenuItem key={yr} value={yr}>
                                                            {yr}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                    </div>
                                )}
                            </RadioGroup>
                        </FormControl>
                    </MenuItem>

                    {/* Apply and Clear Buttons */}
                    <MenuItem>
                        <Button onClick={handleApplyFilters} disabled={!date && !month && !year}>
                            Apply Filters
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
                    </MenuItem>
                </Menu>

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
                            {itineraries.length > 0 ? (
                                itineraries.map(itinerary => itinerary.deletedItinerary === false ? (
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
                                            {itinerary.isDeactivated ? 'Activated' : 'Deactivated'}
                                        </TableCell>
                                        <TableCell>{itinerary.bookedCount}</TableCell>
                                        <TableCell>
                                            {((itinerary.bookedCount * itinerary.price * 0.9) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
                                        </TableCell>
                                    </TableRow>
                                ) : null //We don't output a row when the itinerary has been deleted but cannot be removed from the database since it is booked by previous tourists
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={12}>No itineraries found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box >
        </>
    );
}

export default ItineraryReport;