import { IconButton, DialogContentText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Tooltip } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import MuseumFilterComponent from '../../Components/MuseumHistoricalPlaceComponent/MuseumFilterComponent';


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
    const [formData, setFormData] = useState({
        description: '',
        pictures: [],
        location: '',
        ticketPrices: '',
        openingTime: '',
        closingTime: '',
        museumDate: '',
        museumName: '',
        museumCategory: '',
        tags: [],
        createdBy: ''
    });
    const [createdBy, setCreatedBy] = useState("alya");
    //we should a method that takes the user that is logged in and put this user in the createdBy field so that his 
    // visits are the ones that appear. here we hard coded it to show only alya's things

    // Fetch visits on component mount
    useEffect(() => {
        console.log(createdBy);

        axios.get(`http://localhost:8000/museum/getAllMyMuseums/${createdBy}`)
            .then(response => {
                setMuseums(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the museums!', error);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditClick = (museum) => {
        setFormData(museum);
        setEditingMuseum(museum);
    };

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

    const handleClickOpen = (museum) => {
        setSelectedMuseum(museum);
        setOpen(true);
    };

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

    // Navigate to page to add a tag for museums
    const goToUpcomingPage = () => {
        navigate('/CreateTagMuseum');
    };

    return (
        <>
            <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h4">Available Museum Visits</Typography>
                </Box>

                {/* Button to navigate to page to create tags */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
                        Create Tag for Museum Visits
                    </Button>
                </Box>

                <div>
                    <MuseumFilterComponent />
                </div>

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
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Picture"
                            name="picture"
                            value={formData.pictures}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Ticket Price"
                            name="ticketPrices"
                            value={formData.ticketPrices}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Opening Time"
                            name="openingTime"
                            value={formData.openingTime}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Closing Time"
                            name="closingTime"
                            value={formData.closingTime}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Museum Date"
                            name="museumDate"
                            value={formData.museumDate}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Museum Name"
                            name="museumName"
                            value={formData.museumName}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Museum Category"
                            name="museumCategory"
                            value={formData.museumCategory}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Tags (comma separated)"
                            name="tags"
                            value={formData.tags.join(', ')} // Join tags into a string for editing
                            onChange={e => handleInputChange({ target: { name: 'tags', value: e.target.value.split(', ') } })} // Split on commas to create an array
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" color="primary">Update Museum</Button>
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
