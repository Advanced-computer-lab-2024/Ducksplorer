//This is a component we import inside the CreateTagHistoricalPlace page
import React, { useState } from 'react';
import { message } from 'antd';

function HistoricalPLaceTagForm() {
    // State to hold the value of the tag input field
    const [historicalPlaceTag, setHistoricalPlaceTag] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!historicalPlaceTag) {
            message.error("Please enter a museum tag");
            return;
        }

        // Prepare the data to send to the backend
        const payload = { historicalPlaceTag };

        try {
            // Send POST request to backend to create new tag
            const response = await fetch('http://localhost:8000/historicalPlaceTags/addHistoricalPlaceTag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensure the payload is in JSON format
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle the response from the backend
            if (response.ok) {
                message.success('Historical Place tag added successfully!');
                setHistoricalPlaceTag(''); // Clear the input field after successful submission
            } else {
                message.error(`Error: ${data.message}`);
            }
        } catch (error) {
            // Handle network or other errors
            message.error('Failed to add historical place tag, please try again.');
        }
    };

    return (
        <div>
            <h3>Add a New Historical Place Tag</h3>
            <form onSubmit={handleSubmit}>
                <label>Tag:</label>
                <input
                    type="text"
                    value={historicalPlaceTag}
                    onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                    placeholder="Enter historical place tag"
                    required
                />
                <button type="submit">Add Tag</button>
            </form>
        </div>
    );
}

export default HistoricalPLaceTagForm;
