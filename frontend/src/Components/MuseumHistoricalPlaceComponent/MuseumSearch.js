
//This component is called inside the museumTouristPov page
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

function MuseumSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  // const [searchBy, setSearchBy] = useState('name'); // New state for search criteria

  const handleMuseumSearch = async () => {
    // Ensure at least one field is filled
    // if (!searchTerm) {
    //   alert('Please enter a search criterion (Name, Category, or Tags).'); // Alert for no input
    //   return;
    // }

    // Log the search term being sent to the backend
    console.log("Search term:", searchTerm);

    try {
      const response = await axios.get('http://localhost:8000/museum/searchMuseum', {
        params: {
          searchTerm, // Send the search term based on selected criteria
        },
      });

      console.log("Backend Response:", response); // Log the response

      if (response.status === 200 ) {
        onSearch(response.data.results);  // Pass the search results to the parent component
      } else {
        alert('No museums found. Try refining your search.'); // Alert for no results
        onSearch([]);  // Clear the parent table if no results
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An error occurred: ' + error.message); // Alert for API error
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Search Museum</h2>

      {/* <FormControl component="fieldset">
        <FormLabel component="legend">Search By</FormLabel>
        <RadioGroup row value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <FormControlLabel value="name" control={<Radio />} label="Name" />
          <FormControlLabel value="category" control={<Radio />} label="Category" />
          <FormControlLabel value="tag" control={<Radio />} label="Tags" />
        </RadioGroup>
      </FormControl> */}

      <TextField
        label="Enter Search Term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleMuseumSearch}
        style={{ marginTop: '20px' }}
      >
        Search Museum
      </Button>
    </div>
  );
}

export default MuseumSearch;

// // Used when we had 3 search icons
// import React, { useState } from 'react';
// import axios from 'axios';
// import { message } from 'antd';
// import { Button, TextField } from '@mui/material';

// function MuseumSearch({ onSearch }) {
//   const [museumName, setMuseumName] = useState('');
//   const [museumCategory, setMuseumCategory] = useState('');
//   const [tags, setTags] = useState('');

//   const handlemuseumSearch = async () => {
//     // Ensure at least one field is filled
//     if (!museumName && !museumCategory && !tags) {
//       message.error('Please enter at least one search criterion (Name, Category, or Tags).');
//       return;
//     }

//     // Log the parameters being sent to the backend
//     console.log("Search parameters:", {
//         museumName,
//         museumCategory,
//         tags,
//     });

//     try {
//       const response = await axios.get('http://localhost:8000/museum/searchMuseum', {
//         params: {
//           name: museumName || undefined, // Changed to 'name'
//           category: museumCategory || undefined, // Changed to 'category'
//           tag: tags || undefined, // Changed to 'tag'
//         },
//       });

//       console.log("Backend Response:", response); // Log the response

//       if (response.status === 200 && response.data.results.length > 0) { // Adjusted to check for 'results'
//         message.success('Museum found');
//         onSearch(response.data.results);  // Pass the search results to the parent component
//       } else {
//         message.error('No Museums found. Try refining your search.');
//         onSearch([]);  // Clear the parent table if no results
//       }
//     } catch (error) {
//       console.error('Error during API call:', error);
//       message.error('An error occurred: ' + error.message);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <h2>Search Museum</h2>
//       <TextField
//         label="Enter Name"
//         value={museumName}
//         onChange={(e) => setMuseumName(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Enter Category"
//         value={museumCategory}
//         onChange={(e) => setMuseumCategory(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Enter Tags"
//         value={tags}
//         onChange={(e) => setTags(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handlemuseumSearch}
//         style={{ marginTop: '20px' }}
//       >
//         Search Museum
//       </Button>
//     </div>
//   );
// }

// export default MuseumSearch;