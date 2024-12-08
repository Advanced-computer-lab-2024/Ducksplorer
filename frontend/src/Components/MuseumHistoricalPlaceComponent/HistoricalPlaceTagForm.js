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
        <div style={styles.container}>
            <h3 className="bigTitle">Add a New Historical Place Tag</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Tag:</label>
                <input
                    type="text"
                    value={historicalPlaceTag}
                    onChange={(e) => setHistoricalPlaceTag(e.target.value)}
                    placeholder="Enter historical place tag"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button} className='blackhover'>
                    Add Tag
                </button>
            </form>
        </div>
    );
}

// return (
//     <div>
//         <h3>Add a New Historical Place Tag</h3>
//         <form onSubmit={handleSubmit}>
//             <label>Tag:</label>
//             <input
//                 type="text"
//                 value={historicalPlaceTag}
//                 onChange={(e) => setHistoricalPlaceTag(e.target.value)}
//                 placeholder="Enter historical place tag"
//                 required
//             />
//             <button type="submit">Add Tag</button>
//         </form>
//     </div>
// );
//}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '70vw',
        margin: 'auto',
        marginTop: '50px',
    },
    header: {
        marginBottom: '20px',
        fontSize: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    label: {
        marginBottom: '8px',
        fontSize: '1rem',
        color: '#555',
    },
    input: {
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        outline: 'none',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
};

export default HistoricalPLaceTagForm;
