import { IconButton, DialogContentText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Tooltip } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const RUDHistoricalPlace = () => {
  const navigate = useNavigate();
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedHistoricalPlace, setSelectedHistoricalPlace] = useState(null);
  const [editingHistoricalPlace, setEditingHistoricalPlace] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    pictures: [],
    location: '',
    ticketPrices: '',
    openingTime: '',
    closingTime: '',
    HistoricalPlaceDate: '',
    HistoricalPlaceName: '',
    HistoricalPlaceCategory: '',
    tags: [],
    createdBy: ''
  });
  const [createdBy, setCreatedBy] = useState("alya");
  //we should a method that takes the user that is logged in and put this user in the createdBy field so that his 
  // visits are the ones that appear. here we hard coded it to show only alya's things

  // Fetch visits on component mount
  useEffect(() => {
    console.log(createdBy);

    axios.get(`http://localhost:8000/historicalPlace/getAllMyHistoricalPlaces/${createdBy}`)
      .then(response => {
        setHistoricalPlaces(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the historical places!', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (historicalPlace) => {
    setFormData(historicalPlace);
    setEditingHistoricalPlace(historicalPlace);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8000/historicalPlace/updateHistoricalPlace/${editingHistoricalPlace._id}`, formData)
      .then(() => {
        setHistoricalPlaces(historicalPlaces.map(historicalPlace => (historicalPlace._id === historicalPlace._id ? formData : historicalPlace)));
        message.success('Historical Place updated successfully!');
        setEditingHistoricalPlace(null);
      })
      .catch(error => message.error('Error updating Historical Place!', error));
  };

  const handleClickOpen = (historicalPlace) => {
    setSelectedHistoricalPlace(historicalPlace);
    setOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/historicalPlace/deleteHistoricalPlace/${id}`)
      .then(() => {
        setHistoricalPlaces(historicalPlaces.filter(historicalPlace => historicalPlace._id !== id));
        message.success('Historical Place deleted successfully!');
      })
      .catch(error => {
        message.error('There was an error deleting the historical place!');
        console.error('Error deleting historical place!', error);
      });
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedHistoricalPlace(null);
  };

  const handleConfirmDelete = () => {
    if (selectedHistoricalPlace) {
      handleDelete(selectedHistoricalPlace._id);
    }
    handleClose();
  };

  // Navigate to page to add a tag for historical places
  const goToUpcomingPage = () => {
    navigate('/CreateTagHistoricalPlace');
  };


  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Available Historical Place Visits</Typography>
        </Box>

        {/* Button to navigate to page to create tags */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={goToUpcomingPage}>
            Create Tag for Historical Place Visits
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicalPlaces.map(historicalPlace => (
                <TableRow key={historicalPlace._id}>
                  <TableCell>{historicalPlace.description}</TableCell>
                  <TableCell>{historicalPlace.location}</TableCell>
                  <TableCell>
                    <img
                      src={historicalPlace.pictures}
                      alt="Historical Place"
                      style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                    />
                  </TableCell>
                  <TableCell>{historicalPlace.ticketPrices}</TableCell>
                  <TableCell>{historicalPlace.openingTime}</TableCell>
                  <TableCell>{historicalPlace.closingTime}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceDate}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceName}</TableCell>
                  <TableCell>{historicalPlace.HistoricalPlaceCategory}</TableCell>
                  <TableCell>{historicalPlace.tags.join(', ')}</TableCell>
                  <TableCell>{historicalPlace.createdBy}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Historical Place">
                      <IconButton color="error" onClick={() => handleClickOpen(historicalPlace)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Historical Place">
                      <IconButton color="primary" onClick={() => handleEditClick(historicalPlace)}>
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
        {editingHistoricalPlace && (
          <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
            <Typography variant="h6">Edit Historical Place</Typography>
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
              label="Historical Place Date"
              name="HistoricalPlaceDate"
              value={formData.HistoricalPlaceDate}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Historical Place Name"
              name="HistoricalPlaceName"
              value={formData.HistoricalPlaceName}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Historical Place Category"
              name="HistoricalPlaceCategory"
              value={formData.HistoricalPlaceCategory}
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
            {/* <TextField
              label="Creator "
              name="createdBy"
              value={createdby} // Join tags into a string for editing
              onChange={e => setCreatedBy(createdby)} // Split on commas to create an array
              fullWidth
              sx={{ mb: 2 }}
            /> */}

            <Button type="submit" variant="contained" color="primary">Update Historical Place</Button>
          </form>
        )}

        {/* Confirmation dialog for delete */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this historical place?
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

export default RUDHistoricalPlace;
