////This is the page that gets called for the admin to see users  ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import Sidebar from "../../Components/Sidebars/Sidebar.js";
import { message } from 'antd';
import Error404 from "../../Components/Error404.js";
import AdminNavbar from "../../Components/TopNav/Adminnavbar.js";

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
    FormControlLabel,
    CircularProgress
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useInternalMessage } from "antd/es/message/useMessage.js";

const ActivityReport = () => {
    // Accept userNameId as a prop
    const userName = JSON.parse(localStorage.getItem("user")).username;
    const [users, setUsers] = useState([]);
    //filtering consts
    const [month, setMonth] = useState("");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const [filterType, setFilterType] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);

    const [loading, setLoading] = useState(false);  // State for loading status
    const [error1Message, setErrorMessage] = useState("");  // State for error message

    const errorMessage = "The itinerary you are looking for might be removed or is temporarily unavailable";
    const backMessage = "BACK TO ADMIN AGAIN"
    // Handle fetching activities by userName ID
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const response = await axios.get(
                    `http://localhost:8000/admin/getAllUsersWithEmails`
                );
                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("There was an error fetching user details!", error);
                message.error("error in fetching");
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    //Filtering handlers
    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    //clear all filters
    const handleClearAllFilters = async () => {
        setMonth("");
        setSelectedFilters([]);
        setFiltersApplied(false);

        try {
            const response = await axios.get(`http://localhost:8000/admin/getAllUsersWithEmails`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error resetting users:", error);
        }
        handleFilterClose();
    };

    const fetchFilteredUsers = async () => {
        setLoading(true);
        setErrorMessage(""); // Reset error message before fetching

        try {
            let queryString = '';

            if (month) {
                queryString += `month=${month}`;
            }

            // Fetch users with the constructed query string
            const response = await axios.get(`http://localhost:8000/admin/getAllUsersWithEmailsFilteredByMonth?${queryString}`);

            setUsers(response.data || []);

            if (response.data.length === 0) {
                setErrorMessage("No users found for the selected filters.");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setUsers([]); // Ensure users is cleared on 404
                setErrorMessage("No users found for the selected filters.");
            } else {
                setErrorMessage("Error fetching users!");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!filtersApplied) return;
        if (!month) return;
        fetchFilteredUsers();
    }, [filtersApplied, month]);

    const changeMonth = (newMonth) => {
        setMonth(newMonth);
        setFiltersApplied(true);
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh", // Full screen height
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography sx={{ mt: 2 }} variant="h6" color="text.secondary">
                    Loading users report...
                </Typography>
            </Box>
        );
    }

    if (!Array.isArray(users) || users.length === 0) {
        return (
            <Error404
                errorMessage={errorMessage}
                backMessage={backMessage}
                route="/adminDashboard"
            />
        );
    }

    return (
        <Box
            sx={{
                height: "100vh",
                paddingTop: "64px",
                width: "90vw",
                marginLeft: "5vw",
            }}
        >
            {/* Main Content */}
            <Box
                sx={{
                    flex: 1, // Take the remaining width
                    padding: "32px", // Inner padding
                    margin: "0 auto", // Center content horizontally
                    borderRadius: "12px", // Rounded corners
                }}
            >
                {/* Page Title */}
                <div
                    style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
                >
                    <div style={{ overflowY: "visible", height: "100vh" }}>
                        <Typography
                            variant="h2"
                            sx={{ textAlign: "center", fontWeight: "bold" }}
                            gutterBottom
                        >
                            Users
                        </Typography>
                        <br></br>
                        {/* Navbar */}
                        <AdminNavbar />

                        {/* Sidebar */}
                        <Sidebar />
                        {/* Filtering */}
                        <IconButton onClick={handleFilterChoiceClick}>
                            <FilterAltIcon style={{ color: "black" }} />
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
                                        value={filterType}
                                        onChange={(e) => {
                                            setFilterType(e.target.value);
                                            setMonth(""); // Reset month when filter type changes
                                        }}
                                    >
                                        <FormControlLabel
                                            value="month"
                                            control={<Radio />}
                                            label="Choose Month"
                                        />
                                        {filterType === "month" && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Month</InputLabel>
                                                    <Select
                                                        value={month}
                                                        onChange={(e) => changeMonth(e.target.value)}
                                                    >
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <MenuItem key={i + 1} value={i + 1}>
                                                                {i + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </MenuItem>

                            {/* Clear Buttons */}
                            <MenuItem>
                                <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
                            </MenuItem>
                        </Menu>
                        <TableContainer
                            component={Paper}
                            sx={{
                                marginBottom: 4,
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                                borderRadius: "1.5cap",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }} >User Name</TableCell>
                                        <TableCell sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }} >Role</TableCell>
                                        <TableCell sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }} >Email</TableCell>
                                        <TableCell sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }} >Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.map((userAdded) =>
                                            userAdded ? (
                                                <TableRow >
                                                    <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }} >{userAdded.userName}</TableCell>
                                                    <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>
                                                        {userAdded.role} </TableCell>
                                                    <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{userAdded.email}</TableCell>
                                                    <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{new Date(userAdded.date).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ) : null
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={12}>No users found</TableCell>
                                        </TableRow>
                                    )}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Box>
        </Box>
    );
};

export default ActivityReport;
