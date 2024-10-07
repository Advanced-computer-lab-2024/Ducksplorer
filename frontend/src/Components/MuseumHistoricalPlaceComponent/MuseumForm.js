import React, { useState, useEffect } from 'react';
import { message, Select } from 'antd';

function MuseumForm() {
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState(''); // Change to a string for URL input
    const [location, setLocation] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [museumDate, setMuseumDate] = useState('');
    const [museumName, setMuseumName] = useState('');
    const [museumCategory, setMuseumCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [createdBy, setCreatedBy] = useState('');
    const [error, setError] = useState(null);
    const [museumTagsOptions, setMuseumTagsOptions] = useState([]); // State to store fetched museum tags

    // Fetch museum tags from the backend
    useEffect(() => {
        const fetchMuseumTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/museumTags/getAllMuseumTags');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch museum tags');
                }
                // Store the fetched tags in state
                setMuseumTagsOptions(data);
            } catch (error) {
                message.error(error.message);
            }
        };

        fetchMuseumTags(); // Call the function to fetch tags on component mount
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
        formData.append('museumDate', museumDate);
        formData.append('museumName', museumName);
        formData.append('museumCategory', museumCategory);
        formData.append('tags', tags);
        formData.append('createdBy', userName);

        const response = await fetch('http://localhost:8000/museum/addMuseum', {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();
        if (!response.ok) {
            message.error('There was an error adding the museum!');
        }
        if (response.ok) {
            message.success('Museum added successfully!');
            // Reset form fields
            setDescription('');
            setPictures(''); // Reset to an empty string
            setLocation('');
            setOpeningTime('');
            setClosingTime('');
            setTicketPrices('');
            setMuseumDate('');
            setMuseumName('');
            setMuseumCategory('');
            setTags([]);
            setCreatedBy('');
            setError(null);
            console.log('New museum added', json);
        }
    };

    const handleTagChange = (value) => {
        setTags(value); // Update selected tags
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new museum</h3>

            <label>Museum Description:</label>
            <input type="text" onChange={(e) => setDescription(e.target.value)} value={description} required />

            <label>Pictures (URL):</label>
            <input type="text" onChange={(e) => setPictures(e.target.value)} value={pictures} required /> {/* Changed to accept URL */}

            <label>Museum Location:</label>
            <input type="text" onChange={(e) => setLocation(e.target.value)} value={location} required />

            <label>Museum Opening Time:</label>
            <input type="number" onChange={(e) => setOpeningTime(e.target.value)} value={openingTime} required />

            <label>Museum Closing Time:</label>
            <input type="number" onChange={(e) => setClosingTime(e.target.value)} value={closingTime} required />

            <label>Museum Ticket Prices:</label>
            <input type="number" onChange={(e) => setTicketPrices(e.target.value)} value={ticketPrices} required />

            <label>Museum Visit Date:</label>
            <input type="date" onChange={(e) => setMuseumDate(e.target.value)} value={museumDate} required />

            <label>Museum Name:</label>
            <input type="text" onChange={(e) => setMuseumName(e.target.value)} value={museumName} required />

            <label>Museum Category:</label>
            <input type="text" onChange={(e) => setMuseumCategory(e.target.value)} value={museumCategory} required />

            {/* <label>Tags:</label>
            <input type="text" onChange={(e) => setTags(e.target.value)} value={tags} /> */}

            <label>Tags:</label>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select Museum tags"
                value={tags}
                onChange={handleTagChange}
            >
                {museumTagsOptions.map((tag) => (
                    <Select.Option key={tag._id} value={tag.museumTag}>
                        {tag.museumTag}
                    </Select.Option>
                ))}
            </Select>

            {/* <label>Created By:</label>
            <input type="text" onChange={(e) => setCreatedBy(e.target.value)} value={createdBy} /> */}

            <button>Add a museum</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default MuseumForm;
