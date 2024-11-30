////This is the page that gets called for the admin to see users  ONLY 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyConvertor from '../../Components/CurrencyConvertor';
import AdminSidebar from "../../Components/Sidebars/Sidebar.js";
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
    const [errorMessage, setErrorMessage] = useState("");  // State for error message

    // Handle fetching activities by userName ID
    useEffect(() => {
        const fetchUsers = async () => {
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

            setUsers(response.data);

            if (response.data.length === 0) {
                setErrorMessage("No users found for the selected filters.");
            }
        } catch (error) {
            setErrorMessage("Error fetching users!");
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

    return (
        <>
            <AdminSidebar />
            <div>
                <Box sx={{ p: 6, maxWidth: "120vh", overflowY: "visible", height: "100vh", marginLeft: "350px", }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Typography variant="h4">Users Report</Typography>
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
                    <TableContainer style={{ borderRadius: 20 }} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((userAdded) =>
                                        userAdded ? (
                                            <TableRow >
                                                <TableCell>{userAdded.userName}</TableCell>
                                                <TableCell>
                                                    {userAdded.role} </TableCell>
                                                <TableCell>{userAdded.email}</TableCell>
                                                <TableCell>{new Date(userAdded.date).toLocaleDateString()}</TableCell>
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
                </Box>
            </div>
        </>
    );
};

export default ActivityReport;
