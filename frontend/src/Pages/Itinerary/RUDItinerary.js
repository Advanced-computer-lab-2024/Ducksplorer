import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, IconButton, Box, Button, Table, Typography, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

const RUDItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItinerary, setselectedItinerary] = useState("");
  const [editingItinerary, setEditingItinerary] = useState(null);

  const [formData, setFormData] = useState({
    activity: {
      name: '',
      price: '',
      category: '',
      location: ''
    },
    activities: [],
    locations: [],
    timeline: '',
    language: '',
    price: '',
    availableDatesAndTimes: [],
    accessibility: '',
    pickUpLocation: '',
    dropOffLocation: '',
    rating: '',
  });

  // Handle editing an itinerary
  const handleEditClick = (itinerary) => {
    setFormData({
      ...itinerary,
      activity: itinerary.activity || [], // Ensure activity is an array
    });
    setEditingItinerary(itinerary);
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleActivityInputChange = (event, index) => {
    const { name, value } = event.target;
  
    if (event.type === 'change') {
        setFormData(prevData => {
        const updatedActivities = [...prevData.activity]; // Copy the activities array
        updatedActivities[index] = {
            ...updatedActivities[index], // Spread the current activity object
            [name]: value, // Update the specific field (name, price, etc.)
        };
    
        return {
            ...prevData,
            activity: updatedActivities, // Set the updated activities array
        };
        });
    }
  };
  

  //update
  const handleUpdate = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8000/itinerary/${editingItinerary._id}`, formData)
      .then(() => {
        setItineraries(itineraries.map(itinerary => itinerary._id === editingItinerary._id ? formData : itinerary));
        message.success('Itinerary updated successfully!');
        setEditingItinerary(null);
      })
      .catch(error => message.error('Error updating itinerary!'));
  };

  //read
  useEffect(() => {
    const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
    const user = JSON.parse(userJson); 
    const userName = user.username; 
    if(userName){
        axios.get(`http://localhost:8000/itinerary/myItineraries/${userName}`)
        .then(response => {
            setItineraries(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the itineraries!', error);
        });
    }
  }, []);


  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === 'number') {
        document.activeElement.blur();
      } 
    }
    document.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
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


  return (
    <>
    <Link to="/tourGuideDashboard"> Back </Link>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">
            Your Itineraries
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activities</TableCell>
                <TableCell>Locations</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Available Dates And Times</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Pick Up Location</TableCell>
                <TableCell>Drop Off Location</TableCell>
                <TableCell>Ratings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itineraries.map(itinerary => (
                <TableRow key={itinerary._id}>
                  <TableCell>
                    {itinerary.activity && itinerary.activity.length > 0
                      ? itinerary.activity.map((activity, index) => (
                        <div key={index}>
                          {activity.name || 'N/A'}- Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                          Location: {activity.location || 'N/A'},<br />
                          Category: {activity.category || 'N/A'}
                          <br /><br /> {/* Adds an extra line break between activities */}
                        </div>
                      ))
                      : 'No activities available'}
                  </TableCell>

                  <TableCell>{itinerary.locations}</TableCell>
                  <TableCell>{itinerary.timeline}</TableCell>
                  <TableCell>{itinerary.language}</TableCell>
                  <TableCell>{itinerary.price}</TableCell>
                  <TableCell>
                    {itinerary.availableDatesAndTimes.length > 0
                      ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                        const dateObj = new Date(dateTime); // Create a Date object from the string
                        const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
                        const time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
                        return (
                          <div key={index}>
                            Date {index + 1}: {date}<br />
                            Time {index + 1}: {time}                          </div>
                        );
                      })
                      : 'No available dates and times'}
                  </TableCell>
                  <TableCell>{itinerary.accessibility}</TableCell>
                  <TableCell>{itinerary.pickUpLocation}</TableCell>
                  <TableCell>{itinerary.dropOffLocation}</TableCell>
                  <TableCell>{itinerary.rating}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Itinerary">
                      <IconButton color="error" aria-label="delete category" onClick={() => handleClickOpen(itinerary._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Itinerary">
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
        {editingItinerary && (
          <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
            {formData.activity && formData.activity.map((activity, index) => (
              <div key={index}>
                <TextField
                  label={`Activity ${index + 1} Name`}
                  name="name" 
                  value={activity.name || ''}
                  onChange={(e) => handleActivityInputChange(e, index)}
                  fullWidth
                  sx={{ mb: 2 }}
                />

                <TextField
                  label={`Activity ${index + 1} Price`}
                  name="price"
                  value={activity.price || ''}
                  onChange={(e) => handleActivityInputChange(e, index)}
                  fullWidth
                  sx={{ mb: 2 }}
                  type="number"
                  min="0.01"
                  step="0.01"
                />
                <TextField
                  label={`Activity ${index + 1} Category `}
                  name="category"
                  value={activity.category || ''}
                  onChange={(e) => handleActivityInputChange(e, index)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={`Activity ${index + 1} Location `}
                  name="location"
                  value={activity.location || ''}
                  onChange={(e) => handleActivityInputChange(e, index)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </div>
            ))}
            <TextField label="Locations" name="locations" value={formData.locations} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Timeline" name="timeline" value={formData.timeline} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Language" name="language" value={formData.language} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Price" name="price" value={formData.price} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} type="number" min="0.01" step="0.01" />
            <TextField label="" name="Available Dates and Times" value={formData.availableDatesAndTimes} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} type="datetime-local" />
            <TextField label="Accessbility" name="accessibility" value={formData.accessibility} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Pick Up Location" name="pickUpLocation" value={formData.pickUpLocation} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Drop Off Location" name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" color="primary">Update Itinerary</Button>
          </form>
        )}
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