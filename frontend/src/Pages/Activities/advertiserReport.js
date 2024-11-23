////This is the page that gets called for the advertiser to see HIS activities ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import { message } from 'antd';

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
    Checkbox,
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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar.js";
const ActivityReport = () => {
    // Accept userNameId as a prop
    const userName = JSON.parse(localStorage.getItem("user")).username;
    const [activities, setActivities] = useState([]);
    //filtering consts
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const [filterType, setFilterType] = useState("");

    // Handle fetching activities by userName ID
    useEffect(() => {
        console.log(userName);
        const fetchActivities = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/activity/report/${userName}`
                );
                setActivities(response.data);
            } catch (error) {
                console.error("There was an error fetching the activities!", error);
            }
        };
        fetchActivities();
    }, [userName]); // Depend on userNameId

    //Filtering handlers
    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterToggle = (filter) => {
        const newFilters = [...selectedFilters];
        if (newFilters.includes(filter)) {
            // Remove filter if it's already selected
            const index = newFilters.indexOf(filter);
            newFilters.splice(index, 1);

            switch (filter) {
                case "date":
                    setDate("");
                    break;
                case "month":
                    setMonth("");
                    break;
                case "year":
                    setYear("");
                    break;
                default:
                    break;
            }
        } else {
            // Add filter if not selected
            newFilters.push(filter);
        }
        setSelectedFilters(newFilters);
    };

    //clear all filters
    const handleClearAllFilters = () => {
        setDate("");
        setMonth("");
        setYear("");
        setSelectedFilters([]);

        axios.get
            `http://localhost:8000/activity/report/${userName}`
            .then((response) => {
                setActivities(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the activities!", error);
            });

        handleFilterClose();
    };

    const handleApplyFilters = (filters) => {
        let dateQuery = "";
        let monthQuery = "";
        let yearQuery = "";


        if (date) {
            // Try to convert date to a Date object
            const selectedDate = new Date(date);

            // Check if the conversion is successful and the date is valid
            if (!isNaN(selectedDate.getTime())) {
                dateQuery = selectedDate.toISOString();  // Full date (to match exact date)
                monthQuery = selectedDate.getMonth() + 1;  // Get the month as 1-based (1-12)
                yearQuery = selectedDate.getFullYear();   // Get the year (e.g., 2024)
            }
        }

        // Construct query string with optional parameters
        let queryString = `date=${dateQuery}&month=${monthQuery}&year=${yearQuery}`;

        // Append date, month, or year if they exist
        if (dateQuery) queryString += `&date=${dateQuery}`;
        if (monthQuery) queryString += `&month=${monthQuery}`;
        if (yearQuery) queryString += `&year=${yearQuery}`;

        axios
            .get(`http://localhost:8000/activity/filterReport?${queryString}`)
            .then((response) => {
                setActivities(response.data);
            })
            .catch((error) => {
                message.error("Error fetching activities!");
            });
        handleFilterClose();
        console.log("Applied filters:", filters);
    };

    const generateYearOptions = () => {
        const startYear = 2030;
        const numOptions = 50; // Limit to 50 options
        return Array.from({ length: numOptions }, (_, i) => startYear - i).filter((year) => year >= 0);
    };


    const [priceExchangeRates, setPriceExchangeRates] = useState({});
    const [priceCurrency, setPriceCurrency] = useState('EGP');

    const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
    const [earningsCurrency, setEarningsCurrency] = useState('EGP');

    const handlePriceCurrencyChange = (rates, selectedCurrency) => {
        setPriceExchangeRates(rates);
        setPriceCurrency(selectedCurrency);
    };

    const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
        setEarningsExchangeRates(rates);
        setEarningsCurrency(selectedCurrency);
    };

    return (
        <>
            <AdvertiserSidebar />
            <div>
                <Box
                    sx={{
                        p: 6,
                        maxWidth: "120vh",
                        overflowY: "visible",
                        height: "100vh",
                        marginLeft: "350px",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Typography variant="h4">Sales Advertiser Report</Typography>
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

                    <TableContainer style={{ borderRadius: 20 }} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price
                                        <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                                    </TableCell>
                                    <TableCell>Is open</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Tags</TableCell>
                                    <TableCell>Discount</TableCell>
                                    <TableCell>Dates and Times</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Flag</TableCell>
                                    <TableCell>Number of Bookings</TableCell>
                                    <TableCell>Earnings
                                        <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.map((activity) => activity.deletedActivity === false ? (
                                    <TableRow key={activity._id}>
                                        <TableCell>{activity.name}</TableCell>
                                        <TableCell>
                                            {(activity.price * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)} {priceCurrency}
                                        </TableCell>
                                        <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                                        <TableCell>{activity.category}</TableCell>
                                        <TableCell>{activity.tags.join(", ")}</TableCell>
                                        <TableCell>{activity.specialDiscount}</TableCell>
                                        <TableCell>{activity.date ? (() => {
                                            const dateObj = new Date(activity.date);
                                            const date = dateObj.toISOString().split('T')[0];
                                            const time = dateObj.toTimeString().split(' ')[0];
                                            return (
                                                <div>
                                                    {date} at {time}
                                                </div>
                                            );
                                        })()
                                            : 'No available date'}</TableCell>
                                        <TableCell>{activity.duration}</TableCell>
                                        <TableCell>{activity.location}</TableCell>
                                        <TableCell>
                                            <Rating
                                                value={calculateAverageRating(activity.ratings)}
                                                precision={0.1}
                                                readOnly
                                            />
                                        </TableCell>

                                        <TableCell> {activity.flag ? (
                                            <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                                <WarningIcon style={{ marginRight: '4px' }} />
                                                Inappropriate
                                            </span>
                                        ) : (
                                            <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                                                <CheckCircleIcon style={{ marginRight: '4px' }} />
                                                Appropriate
                                            </span>
                                        )}</TableCell>
                                        <TableCell>{activity.bookedCount}</TableCell>
                                        <TableCell>
                                            {((activity.bookedCount * activity.price * 0.9) * (earningsExchangeRates[earningsCurrency] || 1)).toFixed(2)} {earningsCurrency}
                                        </TableCell>
                                    </TableRow>
                                ) : null)// We don't output a row when the activity has been deleted but cannot be removed from database since it is booked by previous tourists
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        </>
    );
};

export default ActivityReport;
