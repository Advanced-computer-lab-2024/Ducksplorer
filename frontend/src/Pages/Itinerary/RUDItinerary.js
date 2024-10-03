import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {TextField, IconButton,Box, Button, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle ,Tooltip} from '@mui/material';

const RUDItinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItinerary, setselectedItinerary] = useState("");
    const [showTextField, setShowTextField] = useState(false);
    const [newItinerary, setNewItinerary] = useState('');
    const [editingItinerary, setEditingItinerary] = useState(null);
    const [editedItineraryName, setEditedItineraryName] = useState('');
    const [formData, setFormData] = useState({
        activity: [],
        locations: [],
        timeline: '',
        language: '',
        price: '',
        availableDatesAndTimes: [],
        accessibility: '',
        pickUpLocation: '',
        dropOffLocation: '',
    });

    
    const handleItineraryChange = (event) => {
        setNewItinerary(event.target.value);
    };
    
      const handleEditClick = (itinerary) => {
        setEditingItinerary(itinerary);
      };
    
      const handleEditItineraryChange = (event) => {
        setEditedItineraryName(event.target.value);
      };

    useEffect(() => {
        axios.get('http://localhost:8000/itinerary/')
          .then(response => {
            setItineraries(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the itineraries!', error);
          });
      }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/itinerary/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                message.success('Itinerary deleted successfully!');
                setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
            })
            .catch(error => {
                console.log(itineraries);
                message.error('There was an error deleting the itinerary!');
                console.error('There was an error deleting the itinerary!', error);
            });
    };


    const handleClickOpen = (itinerary) => {
        setselectedItinerary(itinerary);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setselectedItinerary(null);
      };
    
      const handleConfirmDelete = () => {
        if (selectedItinerary) {
          handleDelete(selectedItinerary);
        }
        handleClose();
      };

      const handleEdit = (itineraryId, field, newValue) => {
        axios.put(`http://localhost:8000/adminActivity/${itineraryId}`, { field, newValue })
            .then(response => {
                setItineraries(itineraries.map(itinerary =>
                    itinerary._id === itineraryId ? { ...itinerary, [field]: newValue } : itinerary
                ));
                message.success('Itinerary updated successfully!');
            })
            .catch(error => {
                message.error('There was an error updating the itinerary!');
                console.error('There was an error updating the itinerary!', error);
            });
    };
    
    

    

      return (
        <>
        <Box sx={{ p: 6 , maxWidth: 1200}}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Typography variant="h4">
              Available itineraries
            </Typography>
          </Box>
          {showTextField && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <TextField
                label="New Itinerary"
                variant="outlined"
                value={newItinerary}
                onChange={handleItineraryChange}
                sx={{ mr: 2 }}
              />
            </Box>
          )}
           <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Price</TableCell>
              <TableCell>Activities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itineraries.map(itinerary => (
              <TableRow key={itinerary._id}>
                <TableCell>
                    {itinerary.price}
                </TableCell>
                {/* <TableCell>
                  {editingItinerary && editingItinerary._id === itinerary._id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        value={editedItineraryName}
                        onChange={handleEditItineraryChange}
                        autoFocus
                        sx={{ mr: 2 }}
                      />
                      <Button variant="contained" color="primary" onClick={() => handleEdit(itinerary._id, editedItineraryName)}>
                        Confirm
                      </Button>
                    </Box>
                  ) : (
                    itinerary.name
                  )}
                </TableCell> */}
                <TableCell>
                    {itinerary.activity && itinerary.activity.length > 0 
                    ? itinerary.activity.map(activity => 
                        `${activity.name || 'N/A'} - Price: ${activity.price || 'N/A'}, Location: ${activity.location}, Category: ${activity.category}`
                    ).join(', ') 
                    : 'No activities available'}
                </TableCell>
                <TableCell>
                <Tooltip title="Delete Category">
                    <IconButton color="error" aria-label="delete category" onClick={() => handleClickOpen(itinerary._id)}>
                      <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Category">
                    <IconButton color="primary" aria-label="edit category" onClick={() => handleEditClick(itinerary)}>
                      <EditIcon />
                    </IconButton>
                </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Itinerary?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}

export default RUDItinerary;

