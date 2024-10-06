import { IconButton, DialogContentText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Tooltip } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

const RUDVisit = () => {
  const [visits, setVisits] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    pictures: [],
    location: '',
    ticketPrices: '',
    openingTime: '',
    closingTime: '',
    museumHistoricalPlaceDate: '',
    museumHistoricalPlaceName: '',
    museumHistoricalPlaceCategory: '',
    tags: [],
    createdBy: ''
  });
  const [createdBy, setCreatedBy] = useState("alya");
  //we should a method that takes the user that is logged in and put this user in the createdBy field so that his 
  // visits are the ones that appear. here we hard coded it to show only alya's things

  // Fetch visits on component mount
  useEffect(() => {
    console.log(createdBy);

    axios.get(`http://localhost:8000/museumHistoricalPlace/getAllMuseumHistoricalPlace/${createdBy}`)
      .then(response => {
        setVisits(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the visits!', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (visit) => {
    setFormData(visit);
    setEditingVisit(visit);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8000/museumHistoricalPlace/updateMuseumHistoricalPlace/${editingVisit._id}`, formData)
      .then(() => {
        setVisits(visits.map(visit => (visit._id === editingVisit._id ? formData : visit)));
        message.success('Visit updated successfully!');
        setEditingVisit(null);
      })
      .catch(error => message.error('Error updating visit!', error));
  };

  const handleClickOpen = (visit) => {
    setSelectedVisit(visit);
    setOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/museumHistoricalPlace/deleteMuseumHistoricalPlace/${id}`)
      .then(() => {
        setVisits(visits.filter(visit => visit._id !== id));
        message.success('Visit deleted successfully!');
      })
      .catch(error => {
        message.error('There was an error deleting the visit!');
        console.error('Error deleting visit!', error);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVisit(null);
  };

  const handleConfirmDelete = () => {
    if (selectedVisit) {
      handleDelete(selectedVisit._id);
    }
    handleClose();
  };

  return (
    <>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'auto', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">Available Visits</Typography>
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
              {visits.map(visit => (
                <TableRow key={visit._id}>
                  <TableCell>{visit.description}</TableCell>
                  <TableCell>{visit.location}</TableCell>
                  <TableCell>
                    <img
                      src={visit.pictures}
                      alt="Visit"
                      style={{ width: '100px', height: 'auto', objectFit: 'cover' }} // Adjust as needed
                    />
                  </TableCell>
                  <TableCell>{visit.ticketPrices}</TableCell>
                  <TableCell>{visit.openingTime}</TableCell>
                  <TableCell>{visit.closingTime}</TableCell>
                  <TableCell>{visit.museumHistoricalPlaceDate}</TableCell>
                  <TableCell>{visit.museumHistoricalPlaceName}</TableCell>
                  <TableCell>{visit.museumHistoricalPlaceCategory}</TableCell>
                  <TableCell>{visit.tags.join(', ')}</TableCell>
                  <TableCell>{visit.createdBy}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Visit">
                      <IconButton color="error" onClick={() => handleClickOpen(visit)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Visit">
                      <IconButton color="primary" onClick={() => handleEditClick(visit)}>
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
        {editingVisit && (
          <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
            <Typography variant="h6">Edit Visit</Typography>
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
              label="Museum Historical Place Date"
              name="museumHistoricalPlaceDate"
              value={formData.museumHistoricalPlaceDate}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Museum Historical Place Name"
              name="museumHistoricalPlaceName"
              value={formData.museumHistoricalPlaceName}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Museum Historical Place Category"
              name="museumHistoricalPlaceCategory"
              value={formData.museumHistoricalPlaceCategory}
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

            <Button type="submit" variant="contained" color="primary">Update Visit</Button>
          </form>
        )}

        {/* Confirmation dialog for delete */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this visit?
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

export default RUDVisit;
