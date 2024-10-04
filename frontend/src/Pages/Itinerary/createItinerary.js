import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const AddItinerary = () => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/itinerary/', {
                activity: formData.activity,
                locations: formData.locations,
                timeline: formData.timeline,
                language: formData.language,
                price: formData.price,
                availableDatesAndTimes: formData.availableDatesAndTimes,
                accessibility: formData.accessibility,
                pickUpLocation: formData.pickUpLocation,
                dropOffLocation: formData.dropOffLocation,
            });

            if (response.status === 200) {
                message.success('Itinerary added successfully');
                // Optionally, reset the form
                setFormData({
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
            } else {
                message.error('Failed to add itinerary');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        }
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For array fields, split by comma
        if (name === 'locations' || name === 'availableDatesAndTimes') {
            setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) }); // Split and trim values
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };



    return (
        <div>
            <h1>
                Available itineraries
            </h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="activity"
                    placeholder="Activity"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="locations"
                    placeholder="Locations )"
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
                    type="text"
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
        </div>
    );
};

export default AddItinerary;
