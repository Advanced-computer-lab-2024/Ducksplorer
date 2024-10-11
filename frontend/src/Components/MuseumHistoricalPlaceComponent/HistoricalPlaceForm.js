// This file is a component which we import inside the createHistoricalPlace page
import React, { useState, useEffect } from 'react';
import { message, Select } from 'antd';

function HistoricalPlaceForm() {
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState(''); // Changed to a string for URL input
    const [location, setLocation] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [ticketPrices, setTicketPrices] = useState('');
    const [HistoricalPlaceDate, setHistoricalPlaceDate] = useState('');
    const [HistoricalPlaceName, setHistoricalPlaceName] = useState('');
    const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState('');
    const [tags, setTags] = useState([]);
   // const [createdBy, setCreatedBy] = useState(''); //np longer needed because we take the user logged in
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

    //Responisble for taking the data inputted in the form and sending to the method of the backend which will create a new historical place
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string
        const user = JSON.parse(userJson); 
        const userName = user.username;
    
        // Prepare the data to be sent as JSON
        const historicalPlaceData = {
            description,
            pictures, // This now sends an array of URLs
            location,
            openingTime,
            closingTime,
            ticketPrices: ticketPrices.split(',').map(Number), // Convert to array of numbers if needed
            HistoricalPlaceDate, // Make sure to use the correct variable
            HistoricalPlaceName, // Ensure variable is correctly referenced
            HistoricalPlaceCategory, // Ensure variable is correctly referenced
            tags,
            createdBy: userName,
        };
    
        const response = await fetch('http://localhost:8000/historicalPlace/addHistoricalPlace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(historicalPlaceData), // Convert object to JSON string
        });
    
        if (response.ok) {
            const json = await response.json();
            message.success('Historical place added successfully!'); // Success message
            console.log('New historical place added:', json);
            // Reset form fields if necessary
        } else {
            const error = await response.json();
            message.error(error.message || 'There was an error adding the historical place!'); // Error message
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







// USE THIS CODE IF U USE MULTER:
// // This file is a component which we import inside the createHistoricalPlace page
// import React, { useState, useEffect } from 'react';
// import { message, Select } from 'antd';

// function HistoricalPlaceForm() {
//     const [description, setDescription] = useState('');
//     const [pictures, setPictures] = useState(''); // Changed to a string for URL input
//     const [location, setLocation] = useState('');
//     const [openingTime, setOpeningTime] = useState('');
//     const [closingTime, setClosingTime] = useState('');
//     const [ticketPrices, setTicketPrices] = useState('');
//     const [HistoricalPlaceDate, setHistoricalPlaceDate] = useState('');
//     const [HistoricalPlaceName, setHistoricalPlaceName] = useState('');
//     const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState('');
//     const [tags, setTags] = useState([]);
//    // const [createdBy, setCreatedBy] = useState(''); //np longer needed because we take the user logged in
//     const [error, setError] = useState(null);
//     const [historicalPlaceTagsOptions, setHistoricalPlaceTagsOptions] = useState([]);

//     // Fetch tags from backend
//     useEffect(() => {
//         const fetchTags = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags');
//                 const data = await response.json();
//                 setHistoricalPlaceTagsOptions(data); // Store the fetched tags
//             } catch (error) {
//                 console.error("Error fetching historical place tags:", error);
//                 message.error("Failed to load historical place tags.");
//             }
//         };

//         fetchTags();
//     }, []);

//     //Responisble for taking the data inputted in the form and sending to the method of the backend which will create a new historical place
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const userJson = localStorage.getItem('user'); // Get the 'user' item as a JSON string  to have el sha5s el now logged in 
//         const user = JSON.parse(userJson); 
//         const userName = user.username;
//         const formData = new FormData();
//         formData.append('description', description);
//         formData.append('pictures', pictures); // This now expects a URL
//         formData.append('location', location);
//         formData.append('openingTime', openingTime);
//         formData.append('closingTime', closingTime);
//         formData.append('ticketPrices', ticketPrices);
//         formData.append('HistoricalPlaceDate', HistoricalPlaceDate);
//         formData.append('HistoricalPlaceName', HistoricalPlaceName);
//         formData.append('HistoricalPlaceCategory', HistoricalPlaceCategory);
//         formData.append('tags', tags);
//         formData.append('createdBy', userName);

//         const response = await fetch('http://localhost:8000/historicalPlace/addHistoricalPlace', {
//             method: 'POST',
//             body: formData,
//         });

//         const json = await response.json();
//         if (!response.ok) {
//             message.error('There was an error adding the Historical Place!');
//         }
//         if (response.ok) {
//             message.success('Historical Place added successfully!');
//             // Reset form fields
//             setDescription('');
//             setPictures(''); // Reset to an empty string
//             setLocation('');
//             setOpeningTime('');
//             setClosingTime('');
//             setTicketPrices('');
//             setHistoricalPlaceDate('');
//             setHistoricalPlaceName('');
//             setHistoricalPlaceCategory('');
//             setTags([]);
//          //   setCreatedBy(''); not needed anymore
//             setError(null);
//             console.log('New Historical Place added', json);
//         }
//     };

//     return (
//         <form className="create" onSubmit={handleSubmit}>
//             <h3>Add a new Historical Place</h3>

//             <label>Historical Place Description:</label>
//             <input type="text" onChange={(e) => setDescription(e.target.value)} value={description} required />

//             <label>Pictures (URL):</label>
//             <input type="text" onChange={(e) => setPictures(e.target.value)} value={pictures} required /> {/* Changed to accept URL */}

//             <label>Historical Place Location:</label>
//             <input type="text" onChange={(e) => setLocation(e.target.value)} value={location} required />

//             <label>Historical Place Opening Time:</label>
//             <input type="number" onChange={(e) => setOpeningTime(e.target.value)} value={openingTime} required />

//             <label>Historical Place Closing Time:</label>
//             <input type="number" onChange={(e) => setClosingTime(e.target.value)} value={closingTime} required />

//             <label>Historical Place Ticket Prices:</label>
//             <input type="number" onChange={(e) => setTicketPrices(e.target.value)} value={ticketPrices} required />

//             <label>MuseHistorical Placeum Visit Date:</label>
//             <input type="date" onChange={(e) => setHistoricalPlaceDate(e.target.value)} value={HistoricalPlaceDate} required />

//             <label>Historical Place Name:</label>
//             <input type="text" onChange={(e) => setHistoricalPlaceName(e.target.value)} value={HistoricalPlaceName} required />

//             <label>Historical Place Category:</label>
//             <input type="text" onChange={(e) => setHistoricalPlaceCategory(e.target.value)} value={HistoricalPlaceCategory} required />

//             <label>Tags:</label>
//             <Select
//                 mode="multiple"
//                 allowClear
//                 style={{ width: '100%' }}
//                 placeholder="Select tags"
//                 value={tags}
//                 onChange={(selectedTags) => setTags(selectedTags)} // Update tags state
//             >
//                 {historicalPlaceTagsOptions.map((tag) => (
//                     <Select.Option key={tag._id} value={tag.historicalPlaceTag}>
//                         {tag.historicalPlaceTag}
//                     </Select.Option>
//                 ))}
//             </Select>

//             {/* <label>Created By:</label>
//             <input type="text" onChange={(e) => setCreatedBy(e.target.value)} value={createdBy} /> */}

//             <button>Add a Historical Place</button>
//             {error && <div className="error">{error}</div>}
//         </form>
//     );
// }

// export default HistoricalPlaceForm;
