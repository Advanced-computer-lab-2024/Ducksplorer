//This file contains everything related to what the tourism governor can do with the museums: see his created museum visits, create tags, update and delete his visits
import { IconButton, DialogContentText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Tooltip, Select } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CurrencyConvertor from '../../Components/CurrencyConvertor';

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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';

const RUDMuseum = () => {
    const navigate = useNavigate();
    const [museums, setMuseums] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedMuseum, setSelectedMuseum] = useState(null);
    const [editingMuseum, setEditingMuseum] = useState(null);
    const [museumTagsOptions, setMuseumTagsOptions] = useState([]); // State to store fetched museum tags

    const [exchangeRates, setExchangeRates] = useState({});
    const [currency, setCurrency] = useState('EGP');
    const [formData, setFormData] = useState({
        description: '',
        pictures: '', // Changed to a string for link input
        location: '',
        ticketPrices: '',
        openingTime: '',
        closingTime: '',
        museumDate: '',
        museumName: '',
        museumCategory: '',
        tags: [],
        // createdBy: ''
    });
    // const [createdBy, setCreatedBy] = useState("alya");

    // Fetch museums on component mount
    useEffect(() => {
        const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  to get the currently logged in user
        const user = JSON.parse(userJson);
        const userName = user.username;
        console.log(userName);
        // console.log(createdBy);
        if (userName) {
            axios.get(`http://localhost:8000/museum/getAllMyMuseums/${userName}`)
                .then(response => {
                    setMuseums(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the museums!', error);
                });
        }
    }, []);

    const handleCurrencyChange = (rates, selectedCurrency) => {
        setExchangeRates(rates);
        setCurrency(selectedCurrency);
    };

    useEffect(() => {//fetching all the tags because they will be used in the dropdown that appears when we try to  edit the tags of a particular museum visit
        const fetchMuseumTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/museumTags/getAllMuseumTags');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch museum tags');
                }
                // Store the fetched tags in state
                setMuseumTagsOptions(data);
            } catch (error) {
                message.error(error.message);
            }
        };

        fetchMuseumTags(); // Call the function to fetch tags on component mount
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Responsible for when the user clicks on edit icon
    const handleEditClick = (museum) => {
        setFormData(museum);
        setEditingMuseum(museum);
    };

    // When the edit icon is clicked the handleUpdate method calls the backend to execute this update
    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8000/museum/updateMuseum/${editingMuseum._id}`, formData)
            .then(() => {
                setMuseums(museums.map(museum => (museum._id === editingMuseum._id ? formData : museum)));
                message.success('Museum updated successfully!');
                setEditingMuseum(null);
            })
            .catch(error => message.error('Error updating museum!', error));
    };


    // When the delete icon is clicked a popup saying are you sure appears, this method opens it
    const handleClickOpen = (museum) => {
        setSelectedMuseum(museum);
        setOpen(true);
    };

    //Calls the backend to actually delete
    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/museum/deleteMuseum/${id}`)
            .then(() => {
                setMuseums(museums.filter(museum => museum._id !== id));
                message.success('Museum deleted successfully!');
            })
            .catch(error => {
                message.error('There was an error deleting the museum!');
                console.error('Error deleting museum!', error);
            });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMuseum(null);
    };

    const handleConfirmDelete = () => {
        if (selectedMuseum) {
            handleDelete(selectedMuseum._id);
        }
        handleClose();
    };

    // New function to reset editing state and form data
    const handleCancelEdit = () => {
        setEditingMuseum(null);
        setFormData({
            description: '',
            pictures: '', // Reset to empty string
            location: '',
            ticketPrices: '',
            openingTime: '',
            closingTime: '',
            museumDate: '',
            museumName: '',
            museumCategory: '',
            tags: [],
            //createdBy: ''
        });
    };

    // Navigate to page to add a tag for museums
    const goToUpcomingPage = () => {
        navigate('/CreateTagMuseum');
    };

    return (
        <>
            <Link to="/governorDashboard"> Back </Link>
            <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h4">Museums</Typography>
                </Box>

                {/* Button to navigate to page to create tags */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
                        Create Tag for Museum Visits
                    </Button>
                </Box>


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Pictures</TableCell>
                                <TableCell>Ticket Price
                                    <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                                </TableCell>
                                <TableCell>Opening Time</TableCell>
                                <TableCell>Closing Time</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Tags</TableCell>
                                {/* <TableCell>Created By</TableCell> */}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {museums.map(museum => (
                                <TableRow key={museum._id}>
                                    <TableCell>{museum.description}</TableCell>
                                    <TableCell>{museum.location}</TableCell>
                                    <TableCell>
                                        <img
                                            src={museum.pictures} // Assuming this is a string URL
                                            alt="Museum"
                                            style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {(museum.ticketPrices * (exchangeRates[currency] || 1)).toFixed(2)} {currency}
                                    </TableCell>
                                    <TableCell>{museum.openingTime}</TableCell>
                                    <TableCell>{museum.closingTime}</TableCell>
                                    <TableCell>{museum.museumDate}</TableCell>
                                    <TableCell>{museum.museumName}</TableCell>
                                    <TableCell>{museum.museumCategory}</TableCell>
                                    <TableCell>{museum.tags.join(', ')}</TableCell>
                                    {/* <TableCell>{museum.createdBy}</TableCell> */}
                                    <TableCell>
                                        <Tooltip title="Delete Museum">
                                            <IconButton color="error" onClick={() => handleClickOpen(museum)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Museum">
                                            <IconButton color="primary" onClick={() => handleEditClick(museum)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Update form */}
                {editingMuseum && (
                    <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
                        <Typography variant="h6">Edit Museum</Typography>
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Picture" // Singular label
                            name="pictures" // This should match the updated state field
                            value={formData.pictures} // Access the pictures string directly
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Ticket Price"
                            name="ticketPrices"
                            value={formData.ticketPrices}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Opening Time"
                            name="openingTime"
                            value={formData.openingTime}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Closing Time"
                            name="closingTime"
                            value={formData.closingTime}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Museum Date"
                            name="museumDate"
                            value={formData.museumDate}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Museum Name"
                            name="museumName"
                            value={formData.museumName}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Museum Category"
                            name="museumCategory"
                            value={formData.museumCategory}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            required
                        />
                        {/* Tags dropdown */}
                        <label>Tags:</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select tags"
                            value={formData.tags} // Ensure the current tags are displayed in the dropdown
                            onChange={(selectedTags) => setFormData({ ...formData, tags: selectedTags })} // Handle adding/removing tags
                        >
                            {museumTagsOptions.map((tag) => (
                                <Select.Option key={tag._id} value={tag.museumTag}>
                                    {tag.museumTag}
                                </Select.Option>
                            ))}
                        </Select>

                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                            <Button onClick={handleCancelEdit} variant="contained" color="secondary" sx={{ ml: 2 }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                )}

                {/* Confirmation dialog for delete */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this museum?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default RUDMuseum;
