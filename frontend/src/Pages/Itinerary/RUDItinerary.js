import React, { useEffect, useState, createContext, useRef } from 'react';
import axios from 'axios';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import {
  TextField, IconButton, Box, Button, Table, Typography, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';

export const TagsContext = createContext();

const RUDItinerary = () => {
  const [itineraries, setItineraries] = useState([]); //holds the list of itineraries
  const [open, setOpen] = useState(false); //controls the confirmation message before deletion
  const [selectedItinerary, setselectedItinerary] = useState(""); //stores the currently selected itinerary for deletion
  const [editingItinerary, setEditingItinerary] = useState(null); //stores the currently selected itinerary for editing
  const [selectedTags, setSelectedTags] = useState([]); // For storing selected tags
  const [availableTags, setAvailableTags] = useState([]); // For storing fetched tags
  // const [loading, setLoading] = useState(true); //indicates if data is fetched

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
    tag: {
      name: ''
    }
  });

  //Prepares the form for editing by populating it with the selected itinerary's data.
  const handleEditClick = (itinerary) => {
    setFormData({
      ...itinerary,
      activity: itinerary.activity || [],
      locations: itinerary.locations || [],
    });
    setSelectedTags(itinerary.tags || []); // Ensure selected tags are set from the itinerary
    setEditingItinerary(itinerary);
  };

  //updates general input fields based on user input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  //updates location in formData based on input change 
  const handleLocationInputChange = (event, index) => {
    const { value } = event.target;
    setFormData(prevData => {
      const updatedLocations = [...prevData.locations];
      updatedLocations[index] = value;
      return { ...prevData, locations: updatedLocations };
    });
  };

  //updates activity in formData based on input change 
  const handleActivityInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const updatedActivities = [...prevData.activity];
      updatedActivities[index] = {
        ...updatedActivities[index],
        [name]: value,
      };
      return {
        ...prevData,
        activity: updatedActivities,
      };
    });
  };

  //adds a new activity object to the formData
  const addActivity = () => {
    setFormData(prevData => ({
      ...prevData,
      activity: [...prevData.activity, { name: '', price: '', category: '', location: '' }],
    }));
  };

  //deletes an activity based on its index
  const deleteActivity = (index) => {
    const updatedActivities = formData.activity.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      activity: updatedActivities,
    }));
  };

  //updates available dates in formData based on input change 
  const handleAvailableDatesInputChange = (event, index) => {
    const { value } = event.target;
    setFormData(prevData => {
      const updatedDates = [...prevData.availableDatesAndTimes];
      updatedDates[index] = value;
      return { ...prevData, availableDatesAndTimes: updatedDates };
    });
  };

  const handleAddDate = () => {
    setFormData(prevData => ({
      ...prevData,
      availableDatesAndTimes: [...prevData.availableDatesAndTimes, ''],
    }));
  };

  const handleAddLocation = () => {
    setFormData(prevData => ({
      ...prevData,
      locations: [...prevData.locations, ''],
    }));
  };

  const handleDeleteDate = (index) => {
    const newDatesAndTimes = formData.availableDatesAndTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, availableDatesAndTimes: newDatesAndTimes }); // Update state
  };

  const handleDeleteLocation = (index) => {
    const newLocations = formData.locations.filter((_, i) => i !== index);
    setFormData({ ...formData, locations: newLocations });
  };

  //for scrolling automatically when we click edit
  const formRef = useRef(null);

  useEffect(() => {
    if (editingItinerary && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [editingItinerary]);


  //update
  //submit the updated itinerary data.
  const handleUpdate = (event) => {
    event.preventDefault();

    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;

    const updatedData = {
      ...formData,
      tags: selectedTags,
    };

    console.log('Updated Data:', updatedData);

    axios.put(`http://localhost:8000/itinerary/${editingItinerary._id}`, updatedData)
      .then(response => {
        if (userName) {
          return axios.get(`http://localhost:8000/itinerary/myItineraries/${userName}`);
        }
        throw new Error('User not found!');
      })
      .then(response => {
        setItineraries(response.data);
        message.success('Itinerary updated successfully!');
        setEditingItinerary(null);
        setSelectedTags([]);
      })
      .catch(error => {
        console.error('Error updating itinerary or fetching itineraries!', error);
        message.error(`Error updating itinerary: ${error.response ? error.response.data.message : error.message}`);
      });
  };




  useEffect(() => {
    const storedTags = localStorage.getItem('selectedTags');
    if (storedTags) {
      setSelectedTags(JSON.parse(storedTags));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
  }, [selectedTags]);



  //read
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
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

  useEffect(() => {
    const fetchAvailableTags = async () => {
      //setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/preferenceTags/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Tags:', data);
        setAvailableTags(data); // Adjust based on data structure
      } catch (error) {
        console.error('Error fetching available tags:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchAvailableTags();
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

  //Updates the selectedTags state based on the user’s checkbox selections.
  const handleCheckboxChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag); // Remove tag if already selected
      } else {
        return [...prevSelectedTags, tag]; // Add tag if not already selected
      }
    });
  };

  async function toggleItineraryActiveStatus(itineraryId) {
    try {
      const response = await fetch(`http://localhost:8000/itinerary/toggleActiveFlagItinerary/${itineraryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle active status');
      }

      const data = await response.json();
      console.log(`New isActive status after toggle: ${data.itinerary.isActive}`);
      setItineraries(prevItineraries =>
        prevItineraries.map(itinerary =>
          itinerary._id === itineraryId ? { ...itinerary, isActive: !itinerary.isActive } : itinerary
        )
      );
      return data.itinerary;
    } catch (error) {
      console.error('Error toggling itinerary active status:', error);

    }
  }


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
                <TableCell>Tags</TableCell>
                <TableCell>Flag</TableCell>
                <TableCell>Active Status</TableCell>
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
                          {activity.name || 'N/A'} - Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                          Location: {activity.location || 'N/A'},<br />
                          Category: {activity.category || 'N/A'}
                          <br /><br /> {/* Adds an extra line break between activities */}
                        </div>
                      ))
                      : 'No activities available'}
                  </TableCell>

                  <TableCell>
                    {itinerary.locations && itinerary.locations.length > 0 ? (
                      itinerary.locations.map((location, index) => (
                        <div key={index}>
                          <Typography variant="body1">
                            Location {index + 1}: {location.trim()}
                          </Typography>
                          <br />
                        </div>
                      ))
                    ) : 'No locations available'}
                  </TableCell>

                  <TableCell>{itinerary.timeline}</TableCell>
                  <TableCell>{itinerary.language}</TableCell>
                  <TableCell>{itinerary.price}</TableCell>

                  <TableCell>
                    {itinerary.availableDatesAndTimes.length > 0
                      ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                        const dateObj = new Date(dateTime);
                        const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
                        const time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS format
                        return (
                          <div key={index}>
                            Date {index + 1}: {date}<br />
                            Time {index + 1}: {time}
                          </div>
                        );
                      })
                      : 'No available dates and times'}
                  </TableCell>

                  <TableCell>{itinerary.accessibility}</TableCell>
                  <TableCell>{itinerary.pickUpLocation}</TableCell>
                  <TableCell>{itinerary.dropOffLocation}</TableCell>
                  <TableCell>{itinerary.rating}</TableCell>

                  <TableCell>
                    {itinerary.tags && itinerary.tags.length > 0
                      ? itinerary.tags.map((tag, index) => (
                        <div key={index}>
                          {tag || 'N/A'}
                          <br /><br />
                        </div>
                      ))
                      : 'No tags available'}
                  </TableCell>

                  <TableCell>
                    {itinerary.flag ? (
                      <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                        <WarningIcon style={{ marginRight: '4px' }} />
                        Inappropriate
                      </span>
                    ) : (
                      <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon style={{ marginRight: '4px' }} />
                        Appropriate
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color={itinerary.isActive ? 'error' : 'success'}
                      onClick={() => {
                        console.log(`Button clicked for itinerary ID: ${itinerary._id}`); //For debugging
                        toggleItineraryActiveStatus(itinerary._id);
                      }}
                    >
                      {itinerary.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>

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
          <form onSubmit={handleUpdate} style={{ marginTop: '20px' }} ref={formRef} >
            {formData.activity && formData.activity.map((activity, index) => (
              <div key={index}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <TextField
                    label={`Activity ${index + 1} Name`}
                    name="name"
                    value={activity.name || ''}
                    onChange={(e) => handleActivityInputChange(e, index)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  {index === 0 && (
                    <IconButton onClick={addActivity}>
                      <AddCircleIcon color="primary" />
                    </IconButton>
                  )}
                  <IconButton onClick={() => deleteActivity(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </div>
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
            {formData.locations.map((location, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  value={location}
                  onChange={(event) => handleLocationInputChange(event, index)}
                  variant="outlined"
                  fullWidth
                  label={`Location ${index + 1}`}
                />
                {index === 0 && (
                  <IconButton onClick={handleAddLocation}>
                    <AddCircleIcon color="primary" />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteLocation(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <TextField label="Timeline" name="timeline" value={formData.timeline} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Language" name="language" value={formData.language} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Price" name="price" value={formData.price} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} type="number" min="0.01" step="0.01" />
            {formData.availableDatesAndTimes.map((dateTime, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label={`Available Date and Time ${index + 1}`}
                  value={dateTime || ''}
                  onChange={(event) => handleAvailableDatesInputChange(event, index)}
                  fullWidth
                  type="datetime-local"
                />
                {index === 0 && (
                  <IconButton onClick={handleAddDate}>
                    <AddCircleIcon color="primary" />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteDate(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <TextField label="Accessbility" name="accessibility" value={formData.accessibility} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Pick Up Location" name="pickUpLocation" value={formData.pickUpLocation} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Drop Off Location" name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <label key={tag.name}>
                    <input
                      type="checkbox"
                      value={tag.name}
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => handleCheckboxChange(tag.name)}
                    />
                    {tag.name}
                  </label>
                ))
              ) : (
                <p>Loading tags...</p>
              )}
            </div>
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
      </Box >
    </>
  );
}

export default RUDItinerary;