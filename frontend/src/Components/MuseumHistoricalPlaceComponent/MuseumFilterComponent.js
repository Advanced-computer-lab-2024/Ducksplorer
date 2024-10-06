// // // import React from "react";
// // // import { useState } from "react";
// // // import axios from "axios";
// // // import FilterAltIcon from '@mui/icons-material/FilterAlt';
// // // import { message } from 'antd';
// // // import { 
// // //     IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
// // //   } from '@mui/material';


// // // const MuseumFilterComponent = () => {
// // //     const [museums, setMuseums] = useState([]);

// // //     const [tags, setTags] = useState([]);  // Initialize tags as an array

// // //     const [filterAnchorEl, setFilterAnchorEl] = useState(null);

// // //     const [selectedFilters, setSelectedFilters] = useState([]);

// // //     const isFilterSelected = (filter) => selectedFilters.includes(filter);

// // //     const handleFilterChoiceClick = (event) => {
// // //         setFilterAnchorEl(event.currentTarget);
// // //     };

// // //     const handleFilterClose = () => {
// // //         setFilterAnchorEl(null);
// // //     };

// // //     const handleFilterToggle = (filter) => {
// // //         const newFilters = [...selectedFilters];
// // //         if (newFilters.includes(filter)) {
// // //             // Remove filter if it's already selected
// // //             const index = newFilters.indexOf(filter);
// // //             newFilters.splice(index, 1);
// // //         } else {
// // //             // Add filter if not selected
// // //             newFilters.push(filter);
// // //         }
// // //         setSelectedFilters(newFilters);
// // //     };

// // //     // Clear all filters
// // //     const handleClearAllFilters = () => {
// // //         setTags([]);  // Clear tags
// // //         setSelectedFilters([]);

// // //         // Reset museums to initial data by refetching without filters
// // //         axios.get('http://localhost:8000/museum/filterByTags')
// // //             .then(response => {
// // //                 setMuseums(response.data);
// // //             })
// // //             .catch(error => {
// // //                 console.error('There was an error fetching the museums!', error);
// // //             });
// // //     };

// // //     const handleTagsChange = (event) => {
// // //         const value = event.target.value;
// // //         setTags(typeof value === 'string' ? value.split(',') : value);  // Ensure tags is always an array
// // //     };

// // //     // Apply selected filters and fetch filtered results
// // //     const handleFilter = () => {
// // //         const queryTags = tags.length > 0 ? tags : [];

// // //         axios.get('http://localhost:8000/museum/filterByTags', {
// // //             params: { tags: queryTags }
// // //         })
// // //         .then((response) => {
// // //             setMuseums(response.data);

// // //             // Check if the response has data
// // //             if (response.data.length > 0) {
// // //                 message.success('Filtering successful! Showing filtered museums.'); // Success message
// // //             } else {
// // //                 message.warning('No museums found with the selected filters.'); // Warn if no records match the filter
// // //             }
// // //         })
// // //         .catch((error) => {
// // //             message.error('Error applying filters! Please try again.');  // Error message
// // //             console.error('Error:', error);
// // //         });

// // //         handleFilterClose();
// // //     };



// // //     return (
// // //         <div>
// // //             <IconButton onClick={handleFilterChoiceClick}>
// // //                 <FilterAltIcon />
// // //             </IconButton>
// // //             <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
// // //                 <MenuItem>
// // //                     <Checkbox checked={isFilterSelected('tags')} onChange={() => handleFilterToggle('tags')} />
// // //                     Tags
// // //                     <br />
// // //                     <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
// // //                         <InputLabel id="tags-select-label">Tags</InputLabel>
// // //                         <Select
// // //                         labelId="tags-select-label"
// // //                         id="tags-select"
// // //                         multiple
// // //                         value={tags}  // Ensure it's an array
// // //                         onChange={handleTagsChange}
// // //                         renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}  // Handle the selected tags array
// // //                         >
// // //                         <MenuItem value="testf9">testf9</MenuItem>
// // //                         <MenuItem value="history">history</MenuItem>
// // //                         <MenuItem value="German">German</MenuItem>
// // //                         <MenuItem value="French">French</MenuItem>
// // //                         <MenuItem value="Spanish">Spanish</MenuItem>
// // //                         </Select>
// // //                     </FormControl>
// // //                 </MenuItem>

// // //                 <MenuItem>
// // //                     <Button onClick={handleFilter}>Apply Filters</Button>
// // //                 </MenuItem>
// // //                 <MenuItem>
// // //                     <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
// // //                 </MenuItem>
// // //             </Menu>
// // //         </div>
// // //     );
// // // }

// // // export default MuseumFilterComponent;

// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { message } from 'antd';
// // import FilterAltIcon from '@mui/icons-material/FilterAlt';
// // import { 
// //     IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
// // } from '@mui/material';

// // const MuseumFilterComponent = () => {
// //     const [museums, setMuseums] = useState([]);
// //     const [tags, setTags] = useState([]);  // Tags selected by the user
// //     const [allTags, setAllTags] = useState([]);  // All available tags from backend
// //     const [filterAnchorEl, setFilterAnchorEl] = useState(null);
// //     const [selectedFilters, setSelectedFilters] = useState([]);

// //     // Fetch all tags from the backend when component mounts
// //     useEffect(() => {
// //         axios.get('http://localhost:8000/museumTags/getAllMuseumTags')
// //             .then(response => {
// //                 setAllTags(response.data); // Assuming your backend returns an array of tag objects
// //             })
// //             .catch(error => {
// //                 console.error('Error fetching tags:', error);
// //             });
// //     }, []);

// //     const isFilterSelected = (filter) => selectedFilters.includes(filter);

// //     const handleFilterChoiceClick = (event) => {
// //         setFilterAnchorEl(event.currentTarget);
// //     };

// //     const handleFilterClose = () => {
// //         setFilterAnchorEl(null);
// //     };

// //     const handleFilterToggle = (filter) => {
// //         const newFilters = [...selectedFilters];
// //         if (newFilters.includes(filter)) {
// //             // Remove filter if it's already selected
// //             const index = newFilters.indexOf(filter);
// //             newFilters.splice(index, 1);
// //         } else {
// //             // Add filter if not selected
// //             newFilters.push(filter);
// //         }
// //         setSelectedFilters(newFilters);
// //     };

// //     // Clear all filters
// //     const handleClearAllFilters = () => {
// //         setTags([]);  // Clear selected tags
// //         setSelectedFilters([]);

// //         // Reset museums to initial data by refetching without filters
// //         axios.get('http://localhost:8000/museum/filterByTags')
// //             .then(response => {
// //                 setMuseums(response.data);
// //             })
// //             .catch(error => {
// //                 console.error('There was an error fetching the museums!', error);
// //             });
// //     };

// //     const handleTagsChange = (event) => {
// //         const value = event.target.value;
// //         setTags(typeof value === 'string' ? value.split(',') : value);  // Ensure tags is always an array
// //     };

// //     // Apply selected filters and fetch filtered results
// //     const handleFilter = () => {
// //         const queryTags = tags.length > 0 ? tags : [];

// //         axios.get('http://localhost:8000/museum/filterByTags', {
// //             params: { tags: queryTags }
// //         })
// //         .then((response) => {
// //             setMuseums(response.data);

// //             // Check if the response has data
// //             if (response.data.length > 0) {
// //                 message.success('Filtering successful! Showing filtered museums.'); // Success message
// //             } else {
// //                 message.warning('No museums found with the selected filters.'); // Warn if no records match the filter
// //             }
// //         })
// //         .catch((error) => {
// //             message.error('Error applying filters! Please try again.');  // Error message
// //             console.error('Error:', error);
// //         });

// //         handleFilterClose();
// //     };

// //     return (
// //         <div>
// //             <IconButton onClick={handleFilterChoiceClick}>
// //                 <FilterAltIcon />
// //             </IconButton>
// //             <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
// //                 <MenuItem>
// //                     <Checkbox checked={isFilterSelected('tags')} onChange={() => handleFilterToggle('tags')} />
// //                     Tags
// //                     <br />
// //                     <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
// //                         <InputLabel id="tags-select-label">Tags</InputLabel>
// //                         <Select
// //                         labelId="tags-select-label"
// //                         id="tags-select"
// //                         multiple
// //                         value={tags}  // Ensure it's an array
// //                         onChange={handleTagsChange}
// //                         renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}  // Handle the selected tags array
// //                         >
// //                         {allTags.map((tag) => (
// //                             <MenuItem key={tag._id} value={tag.museumTag}>
// //                                 {tag.museumTag}
// //                             </MenuItem>
// //                         ))}
// //                         </Select>
// //                     </FormControl>
// //                 </MenuItem>

// //                 <MenuItem>
// //                     <Button onClick={handleFilter}>Apply Filters</Button>
// //                 </MenuItem>
// //                 <MenuItem>
// //                     <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
// //                 </MenuItem>
// //             </Menu>
// //         </div>
// //     );
// // };

// // export default MuseumFilterComponent;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { message } from 'antd';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import {
//     IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
// } from '@mui/material';

// const MuseumFilterComponent = () => {
//     const [museums, setMuseums] = useState([]);
//     const [tags, setTags] = useState([]);  // Tags selected by the user
//     const [allTags, setAllTags] = useState([]);  // All available tags from backend
//     const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//     const [selectedFilters, setSelectedFilters] = useState([]);

//     // Fetch all tags from the backend when component mounts
//     useEffect(() => {
//         axios.get('http://localhost:8000/museumTags/getAllMuseumTags')
//             .then(response => {
//                 setAllTags(response.data); // Assuming your backend returns an array of tag objects
//             })
//             .catch(error => {
//                 console.error('Error fetching tags:', error);
//             });
//     }, []);

//     const isFilterSelected = (filter) => selectedFilters.includes(filter);

//     const handleFilterChoiceClick = (event) => {
//         setFilterAnchorEl(event.currentTarget);
//     };

//     const handleFilterClose = () => {
//         setFilterAnchorEl(null);
//     };

//     const handleFilterToggle = (filter) => {
//         const newFilters = [...selectedFilters];
//         if (newFilters.includes(filter)) {
//             // Remove filter if it's already selected
//             const index = newFilters.indexOf(filter);
//             newFilters.splice(index, 1);
//         } else {
//             // Add filter if not selected
//             newFilters.push(filter);
//         }
//         setSelectedFilters(newFilters);
//     };

//     // Clear all filters
//     const handleClearAllFilters = () => {
//         setTags([]);  // Clear selected tags
//         setSelectedFilters([]);

//         // Reset museums to initial data by refetching without filters
//         fetchAllMuseums(); // Call the function to fetch all museums
//     };

//     const fetchAllMuseums = () => {
//         axios.get('http://localhost:8000/museum/getAllMuseums') // Ensure this endpoint returns all museums
//             .then(response => {
//                 setMuseums(response.data.results); // Access results directly from the response
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the museums!', error);
//             });
//     };

//     const handleTagsChange = (event) => {
//         const value = event.target.value;
//         setTags(typeof value === 'string' ? value.split(',') : value);  // Ensure tags is always an array
//     };

//     // Apply selected filters and fetch filtered results
//     const handleFilter = () => {
//         const queryTags = tags.length > 0 ? tags : [];

//         axios.get('http://localhost:8000/museum/filterByTags', {
//             params: { tags: queryTags }
//         })
//             .then((response) => {
//                 setMuseums(response.data.results); // Set museums to results from the response

//                 // Check if the response has data
//                 if (response.data.results.length > 0) {
//                     message.success('Filtering successful! Showing filtered museums.'); // Success message
//                 } else {
//                     message.warning('No museums found with the selected filters.'); // Warn if no records match the filter
//                 }
//             })
//             .catch((error) => {
//                 message.error('Error applying filters! Please try again.');  // Error message
//                 console.error('Error:', error);
//             });

//         handleFilterClose();
//     };

//     return (
//         <div>
//             <IconButton onClick={handleFilterChoiceClick}>
//                 <FilterAltIcon />
//             </IconButton>
//             <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
//                 <MenuItem>
//                     <Checkbox checked={isFilterSelected('tags')} onChange={() => handleFilterToggle('tags')} />
//                     Tags
//                     <br />
//                     <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
//                         <InputLabel id="tags-select-label">Tags</InputLabel>
//                         <Select
//                             labelId="tags-select-label"
//                             id="tags-select"
//                             multiple
//                             value={tags}  // Ensure it's an array
//                             onChange={handleTagsChange}
//                             renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}  // Handle the selected tags array
//                         >
//                             {allTags.map((tag) => (
//                                 <MenuItem key={tag._id} value={tag.museumTag}>
//                                     {tag.museumTag}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </MenuItem>

//                 <MenuItem>
//                     <Button onClick={handleFilter}>Apply Filters</Button>
//                 </MenuItem>
//                 <MenuItem>
//                     <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
//                 </MenuItem>
//             </Menu>
//         </div>
//     );
// };

// export default MuseumFilterComponent;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { message } from 'antd';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import {
//     IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
// } from '@mui/material';

// const MuseumFilterComponent = () => {
//     const [museums, setMuseums] = useState([]); // List of museums
//     const [tags, setTags] = useState([]);  // Tags selected by the user
//     const [allTags, setAllTags] = useState([]);  // All available tags from backend
//     const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//     const [selectedFilters, setSelectedFilters] = useState([]);

//     // Fetch all tags from the backend when component mounts
//     useEffect(() => {
//         axios.get('http://localhost:8000/museumTags/getAllMuseumTags')
//             .then(response => {
//                 setAllTags(response.data); // Assuming your backend returns an array of tag objects
//             })
//             .catch(error => {
//                 console.error('Error fetching tags:', error);
//             });
//     }, []);

//     const isFilterSelected = (filter) => selectedFilters.includes(filter);

//     const handleFilterChoiceClick = (event) => {
//         setFilterAnchorEl(event.currentTarget);
//     };

//     const handleFilterClose = () => {
//         setFilterAnchorEl(null);
//     };

//     const handleFilterToggle = (filter) => {
//         const newFilters = [...selectedFilters];
//         if (newFilters.includes(filter)) {
//             // Remove filter if it's already selected
//             const index = newFilters.indexOf(filter);
//             newFilters.splice(index, 1);
//         } else {
//             // Add filter if not selected
//             newFilters.push(filter);
//         }
//         setSelectedFilters(newFilters);
//     };

//     // Clear all filters
//     const handleClearAllFilters = () => {
//         setTags([]);  // Clear selected tags
//         setSelectedFilters([]);
//         fetchAllMuseums(); // Call the function to fetch all museums
//     };

//     // Fetch all museums initially (without any filters)
//     const fetchAllMuseums = () => {
//         axios.get('http://localhost:8000/museum/getAllMuseums')
//             .then(response => {
//                 setMuseums(response.data.results); // Assuming your response contains results
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the museums!', error);
//             });
//     };

//     // Handle tag selection change
//     const handleTagsChange = (event) => {
//         const value = event.target.value;
//         setTags(typeof value === 'string' ? value.split(',') : value);  // Ensure tags is always an array
//     };

//     // Apply selected filters and fetch filtered results
//     const handleFilter = () => {
//         const queryTags = tags.length > 0 ? tags.join(',') : ''; // Join tags into a comma-separated string

//         axios.get('http://localhost:8000/museum/filterByTags', {
//             params: { tags: queryTags } // Send tags as a query parameter
//         })
//             .then((response) => {
//                 setMuseums(response.data.results); // Set museums to results from the response

//                 // Check if the response has data
//                 if (response.data.results.length > 0) {
//                     message.success('Filtering successful! Showing filtered museums.'); // Success message
//                 } else {
//                     message.warning('No museums found with the selected filters.'); // Warn if no records match the filter
//                 }
//             })
//             .catch((error) => {
//                 message.error('Error applying filters! Please try again.');  // Error message
//                 console.error('Error:', error);
//             });

//         handleFilterClose();
//     };

//     return (
//         <div>
//             <IconButton onClick={handleFilterChoiceClick}>
//                 <FilterAltIcon />
//             </IconButton>
//             <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
//                 <MenuItem>
//                     <Checkbox checked={isFilterSelected('tags')} onChange={() => handleFilterToggle('tags')} />
//                     Tags
//                     <br />
//                     <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
//                         <InputLabel id="tags-select-label">Tags</InputLabel>
//                         <Select
//                             labelId="tags-select-label"
//                             id="tags-select"
//                             multiple
//                             value={tags}  // Ensure it's an array
//                             onChange={handleTagsChange}
//                             renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}  // Handle the selected tags array
//                         >
//                             {allTags.map((tag) => (
//                                 <MenuItem key={tag._id} value={tag.museumTag}>
//                                     {tag.museumTag}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </MenuItem>

//                 <MenuItem>
//                     <Button onClick={handleFilter}>Apply Filters</Button>
//                 </MenuItem>
//                 <MenuItem>
//                     <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
//                 </MenuItem>
//             </Menu>
//         </div>
//     );
// };

// export default MuseumFilterComponent;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from 'antd';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
} from '@mui/material';

const MuseumFilterComponent = () => {
    const [museums, setMuseums] = useState([]); // List of museums
    const [tags, setTags] = useState([]);  // Tags selected by the user
    const [allTags, setAllTags] = useState([]);  // All available tags from backend
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    // Fetch all tags from the backend when component mounts
    useEffect(() => {
        axios.get('http://localhost:8000/museumTags/getAllMuseumTags')
            .then(response => {
                setAllTags(response.data); // Assuming your backend returns an array of tag objects
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });

        fetchAllMuseums(); // Fetch museums initially
    }, []);

    // Fetch all museums initially (without any filters)
    const fetchAllMuseums = () => {
        axios.get('http://localhost:8000/museum/getAllMuseums')
            .then(response => {
                setMuseums(response.data.results); // Assuming your response contains results
            })
            .catch(error => {
                console.error('There was an error fetching the museums!', error);
            });
    };

    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    // Handle tag selection change
    const handleTagsChange = (event) => {
        const value = event.target.value;
        setTags(value);  // Ensure tags is always an array
    };

    // // Apply selected filters and fetch filtered results
    // const handleFilter = () => {
    //     // Fetch museums based on selected tags
    //     axios.get('http://localhost:8000/museum/filterByTags', {
    //         params: { tags } // Pass the array of tags directly
    //     })
    //         .then((response) => {
    //             setMuseums(response.data); // Set museums to the filtered results from the response

    //             // Check if the response has data
    //             if (response.data.length > 0) {
    //                 message.success('Filtering successful! Showing filtered museums.'); // Success message
    //             } else {
    //                 message.warning('No museums found with the selected filters.'); // Warn if no records match the filter
    //             }
    //         })
    //         .catch((error) => {
    //             message.error('Error applying filters! Please try again.');  // Error message
    //             console.error('Error:', error);
    //         });

    //     handleFilterClose();
    // };

    const handleFilter = () => {
        console.log('Selected tags for filtering:', tags); // Log selected tags
        axios.get('http://localhost:8000/museum/filterByTags', {
            params: { tags }
        })
            .then((response) => {
                console.log('Response from filterByTags:', response.data); // Log response
                setMuseums(response.data);
                if (response.data.length > 0) {
                    message.success('Filtering successful! Showing filtered museums.');
                } else {
                    message.warning('No museums found with the selected filters.');
                }
            })
            .catch((error) => {
                message.error('Error applying filters! Please try again.');
                console.error('Error:', error);
            });

        handleFilterClose();
    };



    // Clear all filters
    const handleClearAllFilters = () => {
        setTags([]);  // Clear selected tags
        fetchAllMuseums(); // Fetch all museums again
    };

    return (
        <div>
            <IconButton onClick={handleFilterChoiceClick}>
                <FilterAltIcon />
            </IconButton>
            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                <MenuItem>
                    <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                        <InputLabel id="tags-select-label">Tags</InputLabel>
                        <Select
                            labelId="tags-select-label"
                            id="tags-select"
                            multiple
                            value={tags}  // Ensure it's an array
                            onChange={handleTagsChange}
                            renderValue={(selected) => selected.join(', ')}  // Display selected tags
                        >
                            {allTags.map((tag) => (
                                <MenuItem key={tag._id} value={tag.museumTag}>
                                    <Checkbox checked={tags.indexOf(tag.museumTag) > -1} />
                                    {tag.museumTag}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>

                <MenuItem>
                    <Button onClick={handleFilter}>Apply Filters</Button>
                </MenuItem>
                <MenuItem>
                    <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default MuseumFilterComponent;
