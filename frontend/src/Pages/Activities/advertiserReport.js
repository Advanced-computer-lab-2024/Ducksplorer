////This is the page that gets called for the advertiser to see HIS activities ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';

import {
    Rating,
    Box,
    Table,
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar.js";
const ActivityReport = () => {
    // Accept userNameId as a prop
    const userName = JSON.parse(localStorage.getItem("user")).username;
    const [activities, setActivities] = useState([]);

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
                                            : 'No available date and time'}</TableCell>
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
