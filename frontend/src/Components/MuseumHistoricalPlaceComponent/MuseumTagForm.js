import React, { useState } from 'react';
import { message } from 'antd';

function MuseumTagForm() {
    // State to hold the value of the tag input field
    const [museumTag, setMuseumTag] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!museumTag) {
            message.error("Please enter a museum tag");
            return;
        }

        // Prepare the data to send to the backend
        const payload = { museumTag };

        try {
            // Send POST request to backend to create new tag
            const response = await fetch('http://localhost:8000/museumTags/addMuseumTag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensure the payload is in JSON format
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle the response from the backend
            if (response.ok) {
                message.success('Museum tag added successfully!');
                setMuseumTag(''); // Clear the input field after successful submission
            } else {
                message.error(`Error: ${data.message}`);
            }
        } catch (error) {
            // Handle network or other errors
            message.error('Failed to add museum tag, please try again.');
        }
    };

    return (
        <div>
            <h3>Add a New Museum Tag</h3>
            <form onSubmit={handleSubmit}>
                <label>Tag:</label>
                <input
                    type="text"
                    value={museumTag}
                    onChange={(e) => setMuseumTag(e.target.value)}
                    placeholder="Enter museum tag"
                    required
                />
                <button type="submit">Add Tag</button>
            </form>
        </div>
    );
}

export default MuseumTagForm;
