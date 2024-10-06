// import React, { useState } from 'react';
// import { message } from 'antd';

// function HistoricalPlaceForm() {
//     const [description, setDescription] = useState('');
//     const [pictures, setPictures] = useState([]);
//     const [location, setLocation] = useState('');
//     const [openingTime, setOpeningTime] = useState('');
//     const [closingTime, setClosingTime] = useState('');
//     const [ticketPrices, setTicketPrices] = useState('');
//     const [HistoricalPlaceDate, setHistoricalPlaceDate] = useState('');
//     const [HistoricalPlaceName, setHistoricalPlaceName] = useState('');
//     const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState('');
//     const [tags, setTags] = useState('');
//     const [createdBy, setCreatedBy] = useState('');
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Create FormData to handle file uploads
//         const formData = new FormData();
//         formData.append('description', description);
//         formData.append('location', location);
//         formData.append('openingTime', openingTime);
//         formData.append('closingTime', closingTime);
//         formData.append('ticketPrices', ticketPrices);
//         formData.append('HistoricalPlaceDate', HistoricalPlaceDate);
//         formData.append('HistoricalPlaceName', HistoricalPlaceName);
//         formData.append('HistoricalPlaceCategory', HistoricalPlaceCategory);
//         formData.append('tags', tags);
//         formData.append('createdBy', createdBy);

//         // // Append multiple picture files
//         // for (let i = 0; i < pictures.length; i++) {
//         //     formData.append('pictures', pictures[i]);
//         // }

//         const response = await fetch('http://localhost:8000/historicalPlace/addHistoricalPlace', {
//             method: 'POST',
//             body: formData, // Use FormData
//             headers: {
//                 // Do not set Content-Type header for FormData, the browser will automatically handle it
//             },
//         });

//         const json = await response.json();
//         if (!response.ok) {
//             // setError(json.error);
//             message.error('There was an error adding the historical place!');
//         }
//         if (response.ok) {
//             // Clear form fields after successful submission
//             message.success('Historical place added successfully!');
//             setDescription('');
//             setPictures([]);
//             setLocation('');
//             setOpeningTime('');
//             setClosingTime('');
//             setTicketPrices('');
//             setHistoricalPlaceDate('');
//             setHistoricalPlaceName('');
//             setHistoricalPlaceCategory('');
//             setTags('');
//             setCreatedBy('');
//             setError(null);
//             console.log('New historical place added', json);
//         }
//     };


//     // const handlePictureChange = (e) => {
//     //     setPictures([...e.target.files]);
//     // };

//     return (
//         <form className="create" onSubmit={handleSubmit}>
//             <h3>Add a new historical place</h3>

//             <label>Historical Place Description:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setDescription(e.target.value)}
//                 value={description}
//             />


//             {/* <label>Visit Pictures:</label>
//             <input type="file" multiple onChange={handlePictureChange} /> */}

//             <label>Pictures:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setPictures(e.target.value)}
//                 value={pictures}
//             />

//             <label>Historical Place Location:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setLocation(e.target.value)}
//                 value={location}
//             />

//             <label>Historical Place Opening Time:</label>
//             <input
//                 type="number"
//                 onChange={(e) => setOpeningTime(e.target.value)}
//                 value={openingTime}
//             />

//             <label>Historical Place Closing Time:</label>
//             <input
//                 type="number"
//                 onChange={(e) => setClosingTime(e.target.value)}
//                 value={closingTime}
//             />

//             <label>Historical Place Ticket Prices:</label>
//             <input
//                 type="number"
//                 onChange={(e) => setTicketPrices(e.target.value)}
//                 value={ticketPrices}
//             />

//             <label>Historical Place Date:</label>
//             <input
//                 type="date"
//                 onChange={(e) => setHistoricalPlaceDate(e.target.value)}
//                 value={HistoricalPlaceDate}
//             />

//             <label>Historical Place Name:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setHistoricalPlaceName(e.target.value)}
//                 value={HistoricalPlaceName}
//             />

//             <label>Historical Place Category:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setHistoricalPlaceCategory(e.target.value)}
//                 value={HistoricalPlaceCategory}
//             />

//             <label>Tags:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setTags(e.target.value)}
//                 value={tags}
//             />

//             <label>Created By:</label>
//             <input
//                 type="text"
//                 onChange={(e) => setCreatedBy(e.target.value)}
//                 value={createdBy}
//             />

//             <button>Add a historical place visit</button>
//             {error && <div className="error">{error}</div>}
//         </form>
//     );
// }

// export default HistoricalPlaceForm;


import React, { useState, useEffect } from 'react';
import { message, Select } from 'antd';

function HistoricalPlaceForm() {
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState([]);
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

        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append('description', description);
        formData.append('location', location);
        formData.append('openingTime', openingTime);
        formData.append('closingTime', closingTime);
        formData.append('ticketPrices', ticketPrices);
        formData.append('HistoricalPlaceDate', HistoricalPlaceDate);
        formData.append('HistoricalPlaceName', HistoricalPlaceName);
        formData.append('HistoricalPlaceCategory', HistoricalPlaceCategory);
        formData.append('tags', tags); // Send selected tags
        formData.append('createdBy', createdBy);

        const response = await fetch('http://localhost:8000/historicalPlace/addHistoricalPlace', {
            method: 'POST',
            body: formData, // Use FormData
        });

        const json = await response.json();
        if (!response.ok) {
            message.error('There was an error adding the historical place!');
        }
        if (response.ok) {
            message.success('Historical place added successfully!');
            setDescription('');
            setPictures([]);
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
            console.log('New historical place added', json);
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new historical place</h3>

            <label>Historical Place Description:</label>
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />

            <label>Pictures:</label>
            <input
                type="text"
                onChange={(e) => setPictures(e.target.value)}
                value={pictures}
            />

            <label>Historical Place Location:</label>
            <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
            />

            <label>Historical Place Opening Time:</label>
            <input
                type="number"
                onChange={(e) => setOpeningTime(e.target.value)}
                value={openingTime}
            />

            <label>Historical Place Closing Time:</label>
            <input
                type="number"
                onChange={(e) => setClosingTime(e.target.value)}
                value={closingTime}
            />

            <label>Historical Place Ticket Prices:</label>
            <input
                type="number"
                onChange={(e) => setTicketPrices(e.target.value)}
                value={ticketPrices}
            />

            <label>Historical Place Date:</label>
            <input
                type="date"
                onChange={(e) => setHistoricalPlaceDate(e.target.value)}
                value={HistoricalPlaceDate}
            />

            <label>Historical Place Name:</label>
            <input
                type="text"
                onChange={(e) => setHistoricalPlaceName(e.target.value)}
                value={HistoricalPlaceName}
            />

            <label>Historical Place Category:</label>
            <input
                type="text"
                onChange={(e) => setHistoricalPlaceCategory(e.target.value)}
                value={HistoricalPlaceCategory}
            />

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

            <label>Created By:</label>
            <input
                type="text"
                onChange={(e) => setCreatedBy(e.target.value)}
                value={createdBy}
            />

            <button>Add a historical place visit</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default HistoricalPlaceForm;
