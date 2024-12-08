import React, { useState } from 'react';
import { message } from 'antd';

function HistoricalPlaceTagForm() {
  const [historicalPlaceTag, setHistoricalPlaceTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!historicalPlaceTag) {
      message.error("Please enter a historical place tag");
      return;
    }
    const payload = { historicalPlaceTag };
    try {
      const response = await fetch('http://localhost:8000/historicalPlaceTags/addHistoricalPlaceTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Historical Place tag added successfully!');
        setHistoricalPlaceTag('');
      } else {
        message.error(`Error: ${data.message}`);
      }
    } catch (error) {
      message.error('Failed to add historical place tag, please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 className="duckTitle" style={styles.header}>Add a New Tag</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* <label style={styles.label}>Tag:</label> */}
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

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 11px 1px",
    textAlign: "center",
    backgroundColor: "white",
  },
  header: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  label: {
    marginBottom: '8px',
    fontSize: '1.2rem',
    color: '#555',
  },
  input: {
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#1890ff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#40a9ff',
  },
};

export default HistoricalPlaceTagForm;
