import React, { useState, useEffect } from 'react';
import { message, Select } from 'antd';

function HistoricalPlaceForm() {
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState(''); // Change to a string for URL input
    const [location, setLocation] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [HistoricalPlaceDate, setHistoricalPlaceDate] = useState('');
    const [HistoricalPlaceName, setHistoricalPlaceName] = useState('');
    const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [createdBy, setCreatedBy] = useState('');
    const [error, setError] = useState(null);
    const [historicalPlaceTagsOptions, setHistoricalPlaceTagsOptions] = useState([]);

    // Fetch tags from backend
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags');
                const data = await response.json();
                setHistoricalPlaceTagsOptions(data); // Store the fetched tags
            } catch (error) {
                console.error("Error fetching historical place tags:", error);
                message.error("Failed to load historical place tags.");
            }
        };

        fetchTags();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  
        const user = JSON.parse(userJson); 
        const userName = user.username;
        const formData = new FormData();
        formData.append('description', description);
        formData.append('pictures', pictures); // This now expects a URL
        formData.append('location', location);
        formData.append('openingTime', openingTime);
        formData.append('closingTime', closingTime);
        formData.append('ticketPrices', ticketPrices);
        formData.append('HistoricalPlaceDate', HistoricalPlaceDate);
        formData.append('HistoricalPlaceName', HistoricalPlaceName);
        formData.append('HistoricalPlaceCategory', HistoricalPlaceCategory);
        formData.append('tags', tags);
        formData.append('createdBy', userName);

        const response = await fetch('http://localhost:8000/historicalPlace/addHistoricalPlace', {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();
        if (!response.ok) {
            message.error('There was an error adding the Historical Place!');
        }
        if (response.ok) {
            message.success('Historical Place added successfully!');
            // Reset form fields
            setDescription('');
            setPictures(''); // Reset to an empty string
            setLocation('');
            setOpeningTime('');
            setClosingTime('');
            setTicketPrices('');
            setHistoricalPlaceDate('');
            setHistoricalPlaceName('');
            setHistoricalPlaceCategory('');
            setTags([]);
            setCreatedBy('');
            setError(null);
            console.log('New Historical Place added', json);
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new Historical Place</h3>

            <label>Historical Place Description:</label>
            <input type="text" onChange={(e) => setDescription(e.target.value)} value={description} required />

            <label>Pictures (URL):</label>
            <input type="text" onChange={(e) => setPictures(e.target.value)} value={pictures} required /> {/* Changed to accept URL */}

            <label>Historical Place Location:</label>
            <input type="text" onChange={(e) => setLocation(e.target.value)} value={location} required />

            <label>Historical Place Opening Time:</label>
            <input type="number" onChange={(e) => setOpeningTime(e.target.value)} value={openingTime} required />

            <label>Historical Place Closing Time:</label>
            <input type="number" onChange={(e) => setClosingTime(e.target.value)} value={closingTime} required />

            <label>Historical Place Ticket Prices:</label>
            <input type="number" onChange={(e) => setTicketPrices(e.target.value)} value={ticketPrices} required />

            <label>MuseHistorical Placeum Visit Date:</label>
            <input type="date" onChange={(e) => setHistoricalPlaceDate(e.target.value)} value={HistoricalPlaceDate} required />

            <label>Historical Place Name:</label>
            <input type="text" onChange={(e) => setHistoricalPlaceName(e.target.value)} value={HistoricalPlaceName} required />

            <label>Historical Place Category:</label>
            <input type="text" onChange={(e) => setHistoricalPlaceCategory(e.target.value)} value={HistoricalPlaceCategory} required />

            <label>Tags:</label>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select tags"
                value={tags}
                onChange={(selectedTags) => setTags(selectedTags)} // Update tags state
            >
                {historicalPlaceTagsOptions.map((tag) => (
                    <Select.Option key={tag._id} value={tag.historicalPlaceTag}>
                        {tag.historicalPlaceTag}
                    </Select.Option>
                ))}
            </Select>

            {/* <label>Created By:</label>
            <input type="text" onChange={(e) => setCreatedBy(e.target.value)} value={createdBy} /> */}

            <button>Add a Historical Place</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default HistoricalPlaceForm;
