import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";

export const TagsContext = createContext();
let tags = [];

const AddItinerary = () => {

    const navigate = useNavigate();

    //prevents changing numbers lama bena3mel scroll bel mouse
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

    const [prefTagsOptions, setPrefTagsOptions] = useState([]);
    const [locations, setLocations] = useState(['']);
    const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(['']);
    const [activities, setActivities] = useState([
        {
            name: '',
            isOpen: false,
            date: '',
            location: '',
            price: '',
            category: '',
            tags: '',
            duration: ''
        }
    ]);



    const [formData, setFormData] = useState({
        locations: [],
        timeline: '',
        language: '',
        price: '',
        availableDatesAndTimes: [],
        accessibility: '',
        pickUpLocation: '',
        dropOffLocation: '',
        tag: {
            name: ''
        }
    });

    //fetch all tags from the server
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/preferenceTags/');
                const data = await response.json();
                setPrefTagsOptions(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    //changes the value of the datetime when creating from default value to the value entered
    const handleAvailableDateChange = (index, value) => {
        const newDates = [...availableDatesAndTimes];
        newDates[index] = value;
        setAvailableDatesAndTimes(newDates);
        setFormData({ ...formData, availableDatesAndTimes: newDates });
    };

    //changes the values of attributes inside the activity when creating from default value to the value entered
    const handleActivityChange = (index, field, value) => {
        const updatedActivities = activities.map((activity, i) =>
            i === index ? { ...activity, [field]: value } : activity
        );
        setActivities(updatedActivities);
    };

    //changes the value of any general attribute when creating and the new value is added to the formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    //to append a new location in the array of locations
    const handleAddLocation = () => {
        setLocations([...locations, '']);
    };

    //to append a new available date and time in the array of dates
    const handleAddAvailableDate = () => {
        setAvailableDatesAndTimes([...availableDatesAndTimes, '']);
    };

    //to append a new activity in the array of activities
    const handleAddActivity = () => {
        const newActivity = {
            name: '',
            isOpen: false,
            date: '',
            location: '',
            price: '',
            category: '',
            tags: '',
            duration: ''
        };
        setActivities([...activities, newActivity]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userJson = localStorage.getItem('user');
        const user = JSON.parse(userJson);
        const userName = user.username;

        try {
            console.log(tags)
            const response = await axios.post('http://localhost:8000/itinerary/', {
                activity: activities,
                locations,
                timeline: formData.timeline,
                language: formData.language,
                price: formData.price,
                availableDatesAndTimes,
                accessibility: formData.accessibility,
                pickUpLocation: formData.pickUpLocation,
                dropOffLocation: formData.dropOffLocation,
                tourGuideUsername: userName,
                tags // Make sure to include selected tags here
            });
            console.log(response.data)

            if (response.status === 200) {
                message.success('Itinerary added successfully');
                // Reset form data here
                resetForm();
                navigate('/tourGuideDashboard');
            } else {
                message.error('Failed to add itinerary');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        }
    };

    //restests all the values of attributes when needed (ex. adding new input) before adding the new values
    const resetForm = () => {
        setActivities([{
            name: '',
            isOpen: false,
            date: '',
            location: '',
            price: '',
            category: '',
            tags: '',
            duration: ''
        }]);
        setLocations(['']);
        setAvailableDatesAndTimes(['']);
        setFormData({
            locations: [],
            timeline: '',
            language: '',
            price: '',
            accessibility: '',
            pickUpLocation: '',
            dropOffLocation: '',
            tag: {
                name: ''
            }
        });
    };

    return (
        <div>
            <Link to="/tourGuideDashboard"> Back </Link>
            <Box sx={{ overflowY: 'visible', height: "100vh" }}>
                <h1>Create an Itinerary</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activities.map((activity, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Activity Name"
                                value={activity.name}
                                onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                                required
                            />
                            <label>Activity Is Open?</label>
                            <input
                                type="checkbox"
                                checked={activity.isOpen}
                                onChange={(e) => handleActivityChange(index, 'isOpen', e.target.checked)}
                            />
                            <input
                                type="datetime-local"
                                placeholder="Activity Date"
                                value={activity.date}
                                onChange={(e) => handleActivityChange(index, 'date', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Activity Location"
                                value={activity.location}
                                onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Activity Price"
                                value={activity.price}
                                onChange={(e) => handleActivityChange(index, 'price', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Activity Category"
                                value={activity.category}
                                onChange={(e) => handleActivityChange(index, 'category', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Activity Tags"
                                value={activity.tags}
                                onChange={(e) => handleActivityChange(index, 'tags', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Activity Duration"
                                value={activity.duration}
                                onChange={(e) => handleActivityChange(index, 'duration', e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <IconButton onClick={handleAddActivity}>
                        <AddCircleIcon color="primary" />
                    </IconButton>
                    <h3>Locations:</h3>
                    {locations.map((location, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => {
                                const newLocations = [...locations];
                                newLocations[index] = e.target.value;
                                setLocations(newLocations);
                            }}
                            required
                        />
                    ))}
                    <IconButton onClick={handleAddLocation}>
                        <AddCircleIcon color="primary" />
                    </IconButton>
                    <input
                        type="text"
                        name="timeline"
                        placeholder="Timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />
                    <h3>Available Dates and Times:</h3>
                    {availableDatesAndTimes.map((dateTime, index) => (
                        <input
                            key={index}
                            type="datetime-local"
                            placeholder="Available Date and Time"
                            value={dateTime}
                            onChange={(e) => handleAvailableDateChange(index, e.target.value)} // Update date/time
                            required
                        />
                    ))}
                    <IconButton onClick={handleAddAvailableDate}>
                        <AddCircleIcon color="primary" />
                    </IconButton>
                    <input
                        type="text"
                        name="accessibility"
                        placeholder="Accessibility"
                        value={formData.accessibility}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="pickUpLocation"
                        placeholder="Pick Up Location"
                        value={formData.pickUpLocation}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="dropOffLocation"
                        placeholder="Drop Off Location"
                        value={formData.dropOffLocation}
                        onChange={handleChange}
                        required
                    />
                    <div
                        style={{
                            display: "Flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            flexBasis: 10,
                        }}
                    >
                        {prefTagsOptions.map((element) => {
                            return (
                                <TagsContext.Provider key={element._id} value={tags}>
                                    <StandAloneToggleButtonIt key={element._id} name={element.name} />
                                </TagsContext.Provider>
                            );
                        })}
                    </div>
                    <button type="submit">Add Itinerary</button>
                </form>
            </Box>
        </div>
    );
};

export default AddItinerary;
