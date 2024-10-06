import React, { useState } from 'react';
import { message } from 'antd';

function VisitForm() {
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState([]);
    const [location, setLocation] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [museumHistoricalPlaceDate, setMuseumHistoricalPlaceDate] = useState('');
    const [museumHistoricalPlaceName, setMuseumHistoricalPlaceName] = useState('');
    const [museumHistoricalPlaceCategory, setMuseumHistoricalPlaceCategory] = useState('');
    const [tags, setTags] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append('description', description);
        formData.append('location', location);
        formData.append('openingTime', openingTime);
        formData.append('closingTime', closingTime);
        formData.append('ticketPrices', ticketPrices);
        formData.append('museumHistoricalPlaceDate', museumHistoricalPlaceDate);
        formData.append('museumHistoricalPlaceName', museumHistoricalPlaceName);
        formData.append('museumHistoricalPlaceCategory', museumHistoricalPlaceCategory);
        formData.append('tags', tags);
        formData.append('createdBy', createdBy);

        // // Append multiple picture files
        // for (let i = 0; i < pictures.length; i++) {
        //     formData.append('pictures', pictures[i]);
        // }

        const response = await fetch('http://localhost:8000/museumHistoricalPlace/addMuseumHistoricalPlace', {
            method: 'POST',
            body: formData, // Use FormData
            headers: {
                // Do not set Content-Type header for FormData, the browser will automatically handle it
            },
        });

        const json = await response.json();
        if (!response.ok) {
            // setError(json.error);
            message.error('There was an error adding the visit!');
        }
        if (response.ok) {
            // Clear form fields after successful submission
            message.success('Visit added successfully!');
            setDescription('');
            setPictures([]);
            setLocation('');
            setOpeningTime('');
            setClosingTime('');
            setTicketPrices('');
            setMuseumHistoricalPlaceDate('');
            setMuseumHistoricalPlaceName('');
            setMuseumHistoricalPlaceCategory('');
            setTags('');
            setCreatedBy('');
            setError(null);
            console.log('New visit added', json);
        }
    };


    // const handlePictureChange = (e) => {
    //     setPictures([...e.target.files]);
    // };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new visit</h3>

            <label>Visit Description:</label>
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />


            {/* <label>Visit Pictures:</label>
            <input type="file" multiple onChange={handlePictureChange} /> */}

            <label>Pictures:</label>
            <input
                type="text"
                onChange={(e) => setPictures(e.target.value)}
                value={pictures}
            />

            <label>Visit Location:</label>
            <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
            />

            <label>Visit Opening Time:</label>
            <input
                type="number"
                onChange={(e) => setOpeningTime(e.target.value)}
                value={openingTime}
            />

            <label>Visit Closing Time:</label>
            <input
                type="number"
                onChange={(e) => setClosingTime(e.target.value)}
                value={closingTime}
            />

            <label>Visit Ticket Prices:</label>
            <input
                type="number"
                onChange={(e) => setTicketPrices(e.target.value)}
                value={ticketPrices}
            />

            <label>Visit Date:</label>
            <input
                type="date"
                onChange={(e) => setMuseumHistoricalPlaceDate(e.target.value)}
                value={museumHistoricalPlaceDate}
            />

            <label>Visit Name:</label>
            <input
                type="text"
                onChange={(e) => setMuseumHistoricalPlaceName(e.target.value)}
                value={museumHistoricalPlaceName}
            />

            <label>Visit Category:</label>
            <input
                type="text"
                onChange={(e) => setMuseumHistoricalPlaceCategory(e.target.value)}
                value={museumHistoricalPlaceCategory}
            />

            <label>Tags:</label>
            <input
                type="text"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
            />

            <label>Created By:</label>
            <input
                type="text"
                onChange={(e) => setCreatedBy(e.target.value)}
                value={createdBy}
            />

            <button>Add a visit</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default VisitForm;
