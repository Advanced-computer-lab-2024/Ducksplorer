import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Link } from 'react-router-dom';

const AddItinerary = () => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
        const user = JSON.parse(userJson);
        const userName = user.username;

        try {
            const response = await axios.post('http://localhost:8000/itinerary/', {
                'activity.name': formData.activity.name, // Use quotes for keys with dots
                'activity.isOpen': formData.activity.isOpen,
                'activity.date': formData.activity.date,
                'activity.location': formData.activity.location,
                'activity.price': formData.activity.price,
                'activity.category': formData.activity.category,
                'activity.tags': formData.activity.tags,
                'activity.duration': formData.activity.duration,
                locations: formData.locations,
                timeline: formData.timeline,
                language: formData.language,
                price: formData.price,
                availableDatesAndTimes: formData.availableDatesAndTimes,
                accessibility: formData.accessibility,
                pickUpLocation: formData.pickUpLocation,
                dropOffLocation: formData.dropOffLocation,
                tourGuideUsername: userName
            });

            if (response.status === 200) {
                message.success('Itinerary added successfully');

                // Reset form data here
                setFormData({
                    activity: {
                        name: '',
                        isOpen: false,
                        date: '',
                        location: '',
                        price: '',
                        category: '',
                        tags: '',
                        duration: ''
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
            } else {
                message.error('Failed to add itinerary');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        }
    };


    const [formData, setFormData] = useState({
        activity: {
            name: '',
            isOpen: false,
            date: '',
            location: '',
            price: '',
            category: '',
            tags: '',
            duration: ''
        },
        locations: [],
        timeline: '',
        language: '',
        price: '',
        availableDatesAndTimes: [],
        accessibility: '',
        pickUpLocation: '',
        dropOffLocation: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('activity.')) {
            // Extract the field name after 'activity.' and update nested activity state
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                activity: {
                    ...formData.activity,
                    [field]: value
                }
            });
        } else if (name === 'locations' || name === 'availableDatesAndTimes') {
            // Handle array fields
            setFormData({
                ...formData,
                [name]: value.split(',').map(item => item.trim())
            });
        } else {
            // Handle other fields
            setFormData({ ...formData, [name]: value });
        }
    };




    return (
        <div>
            <Link to="/tourGuideDashboard"> Back </Link>
            <h1>
                Create an Itinerary
            </h1>
            <box >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        name="activity.name"  // Dot notation to target 'name' inside 'activity'
                        placeholder="Activity Name"
                        value={formData.activity.name || ''}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%',  // Full width of the parent
                          }} 
                          InputProps={{
                            style: { padding: '10px' } // Adding padding to the input
                          }}
                    />
                    <label>Activity Is Open?</label>

                    <input
                        type="checkbox"  
                        name="activity.isOpen"  
                        checked={formData.activity.isOpen || false}  
                        onChange={(e) => setFormData({
                            ...formData,
                            activity: {
                                ...formData.activity,
                                isOpen: e.target.checked  
                            }
                        })}
                        required
                    />
                    <input
                        type="datetime-local"
                        name="activity.date"  // Dot notation to target 'date' inside 'activity'
                        placeholder="Activity Date"
                        value={formData.activity.date || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="activity.location"
                        placeholder="Activity Location"
                        value={formData.activity.location || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="activity.price"
                        placeholder="Activity Price"
                        value={formData.activity.price || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="activity.category"
                        placeholder="Activity Category"
                        value={formData.activity.category || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="activity.tags"
                        placeholder="Activity Tags"
                        value={formData.activity.tags || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="activity.duration"
                        placeholder="Activity Duration"
                        value={formData.activity.duration || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="locations"
                        placeholder="Locations"
                        value={formData.locations.join(', ')} // Convert array to string for input
                        onChange={handleChange}
                        required
                    />
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
                    <input
                        type="datetime-local"
                        name="availableDatesAndTimes"
                        placeholder="Available Dates and Times (comma separated)"
                        value={formData.availableDatesAndTimes.join(', ')} // Convert array to string for input
                        onChange={handleChange}
                        required
                    />
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
                    <button type="submit">Add Itinerary</button>
                </form>
            </box>
        </div>
    );
};

export default AddItinerary;
