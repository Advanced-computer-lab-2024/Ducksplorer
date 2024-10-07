import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from 'antd';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    IconButton, Menu, MenuItem, Checkbox, Button, FormControl, InputLabel, Select
} from '@mui/material';

const HistoricalPlaceFilterComponent = ({ onFilter }) => {
    const [tags, setTags] = useState([]);  // Tags selected by the user
    const [allTags, setAllTags] = useState([]);  // All available tags from backend
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    // Fetch all tags from the backend when component mounts
    useEffect(() => {
        axios.get('http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags')
            .then(response => {
                setAllTags(response.data); // Assuming your backend returns an array of tag objects
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });
    }, []);

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

    // Apply the selected filters
    const handleFilter = () => {
        // Ensure all tags are strings
        const formattedTags = tags.map(tag => tag.toLowerCase()); // Normalizing to lower case

        axios.get('http://localhost:8000/historicalPlace/filterByTags', {
            params: { tags: formattedTags } // Send formatted tags
        })
            .then((response) => {
                onFilter(response.data); // Pass filtered results to parent
                if (response.data.length > 0) {
                    message.success('Filtering successful! Showing filtered Historical Places.');
                } else {
                    message.warning('No Historical Places found with the selected filters.');
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

        // Fetch all Historical Places from the parent component by passing an empty filter
        axios.get(`http://localhost:8000/historicalPlace/getAllHistoricalPlaces`)
            .then(response => {
                onFilter(response.data); // Pass all Historical Places to parent component
                message.success('Cleared all filters! Showing all Historical Places.');
            })
            .catch(error => {
                console.error('Error fetching all Historical Places!', error);
                message.error('Error fetching all Historical Places! Please try again.');
            });
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
                                <MenuItem key={tag._id} value={tag.historicalPlaceTag}>
                                    <Checkbox checked={tags.indexOf(tag.historicalPlaceTag) > -1} />
                                    {tag.historicalPlaceTag}
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

export default HistoricalPlaceFilterComponent;
