import React from "react";
import {useState, useEffect}  from "react";
import axios from "axios";
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    MenuItem, IconButton, Menu, Checkbox, Slider, Button, FormControl, InputLabel, Select
  } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { message } from 'antd';
import { Link } from 'react-router-dom';


const ViewUpcomingItinerary = () => {
    const [itineraries, setItineraries] = useState([]);

    //sorting consts
    const [sortBy, setSortBy] = useState('price'); // Default to 'price'
    const [sortOrder, setSortOrder] = useState('asc'); // Default to 'asc'

    const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
    const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null);

    //filtering consts
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [language, setLanguage] = useState('');
    const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 5000]); 
    const [tags, setTags] = useState([]);  // Tags selected by the user
    const [allTags, setAllTags] = useState([]);  // All available tags from backend

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    //get all pref tags from table
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/preferenceTags/');
                const data = await response.json();
                setAllTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);
    
    const isFilterSelected = (filter) => selectedFilters.includes(filter);

    // Handlers for Sort By dropdown
    const handleSortByClick = (event) => {
        setSortByAnchorEl(event.currentTarget);
    };
    const handleSortByClose = () => {
        setSortByAnchorEl(null);
    };

    // Handlers for Sort Order dropdown
    const handleSortOrderClick = (event) => {
        setSortOrderAnchorEl(event.currentTarget);
    };
    const handleSortOrderClose = () => {
        setSortOrderAnchorEl(null);
    };

    //Filtering handlers
    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleTagsChange = (event) => {
        const value = event.target.value;
        setTags(value);  // Ensure tags is always an array
    };

    const handleFilterToggle = (filter) => {
        const newFilters = [...selectedFilters];
        if (newFilters.includes(filter)) {
            // Remove filter if it's already selected
            const index = newFilters.indexOf(filter);
            newFilters.splice(index, 1);

            switch(filter) {
                case 'minPrice':
                    setMinPrice('');
                    break;
                case 'maxPrice':
                    setMaxPrice('');
                    break;
                case 'language':
                    setLanguage('');
                    break;
                case 'availableDatesAndTimes':
                    setAvailableDatesAndTimes(null);
                    break;
                default:
                    break;
            }
        } else {
            // Add filter if not selected
            newFilters.push(filter);
        }
        setSelectedFilters(newFilters);
    };

    //clear all filters
    const handleClearAllFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setLanguage('');
        setAvailableDatesAndTimes(null);
        setSelectedFilters([]);
        setTags([]); 

        axios.get('http://localhost:8000/itinerary/upcoming')
            .then(response => {
                setItineraries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the itineraries!', error);
            });
        
        handleFilterClose();
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setMinPrice(newValue[0]);
        setMaxPrice(newValue[1]);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };
    

    //for price slider
    const [anchorEl, setAnchorEl] = useState(null);

    
    //get upcoming itineraries
    useEffect(() => {
        axios.get('http://localhost:8000/itinerary/upcoming')
          .then(response => {
            setItineraries(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the itineraries!', error);
          });
    }, []);


    //get itineraries based on the sorting criteria
    const handleSort = (sortBy, sortOrder) => {
        axios.get(`http://localhost:8000/itinerary/sort?sortBy=${sortBy}&sortOrder=${sortOrder}`)
            .then((response) => {
                setItineraries(response.data); 
            })
            .catch(error => {
                message.error('Error fetching itineraries!')
            });
    }

    //encoding tags
    const encodeTags = (tags) => {
        if (Array.isArray(tags)) {
            return tags.map(tag => encodeURIComponent(tag));
        }
        return encodeURIComponent(tags);
    };

    //filter by price, lang, or dates
    const handleFilter = () => {
        let dateQuery = '';
        const encodedTags = encodeTags(tags).join(',');
    
        if (availableDatesAndTimes) {
            // Try to convert availableDatesAndTimes to a Date object
            const selectedDate = new Date(availableDatesAndTimes);
            
            // Check if the conversion is successful and the date is valid
            if (!isNaN(selectedDate.getTime())) {
                dateQuery = selectedDate.toISOString();
            }
        }
        axios.get(`http://localhost:8000/itinerary/filterUpcoming?minPrice=${minPrice}&maxPrice=${maxPrice}&language=${language}&availableDatesAndTimes=${dateQuery}&tags=${encodedTags}`)
            .then((response) => {
                setItineraries(response.data); 
            })
            .catch(error => {
                message.error('Error fetching itineraries!')
            });
        handleFilterClose();
    }

    return (
        <div>
        <Link to="/touristDashboard"> Back </Link>
        <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Typography variant="h4">
                Upcoming Itineraries
            </Typography>
            </Box>
        <Box sx={{ display: 'flex', justifyContent: 'normal', mb: 2 }}>
            {/* Sort By Icon Button */}
            <IconButton onClick={handleSortByClick}>
                <SortIcon />
            </IconButton>
            <Menu
                anchorEl={sortByAnchorEl}
                open={Boolean(sortByAnchorEl)}
                onClose={handleSortByClose}
            >
                <MenuItem value="price" onClick={() => { setSortBy('price'); handleSort('price', sortOrder); handleSortByClose(); }}>Price</MenuItem>
                <MenuItem value="rating" onClick={() => { setSortBy('rating');  handleSort('rating', sortOrder); handleSortByClose(); }}>Rating</MenuItem>
            </Menu>

            <IconButton onClick={handleSortOrderClick}>
                <SwapVertIcon />
            </IconButton>
            <Menu
                anchorEl={sortOrderAnchorEl}
                open={Boolean(sortOrderAnchorEl)}
                onClose={handleSortOrderClose}
            >
                <MenuItem value="asc" onClick={() => { setSortOrder('asc'); handleSort(sortBy, 'asc'); handleSortOrderClose();  }}>Ascending</MenuItem>
                <MenuItem value="desc" onClick={() => { setSortOrder('desc'); handleSort(sortBy, 'desc'); handleSortOrderClose(); }}>Descending</MenuItem>
            </Menu>

            {/* Filtering */}
            <IconButton onClick={handleFilterChoiceClick}>
                <FilterAltIcon />
            </IconButton>
            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                <MenuItem>
                    <Checkbox checked={isFilterSelected('price')}
                        onChange={(e) => {
                            handleFilterToggle('price');
                            if (!e.target.checked) {
                                // Reset price filters if unchecked
                                setMinPrice('');
                                setMaxPrice('');
                                setPriceRange([0, 5000]); // Reset the slider to initial values
                            }
                        }} 
                    />
                    Price
                    <br />
                    <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Select Price Range</Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem>
                        <Typography variant="subtitle1">Select Range:</Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={5000}
                            sx={{ width: 300, marginLeft: 2 }} // Adjust slider width and margin
                        />
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="body1">Selected Min: {priceRange[0]}</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="body1">Selected Max: {priceRange[1]}</Typography>
                        </MenuItem>
                    </Menu>
                </MenuItem>

                <MenuItem>
                    <Checkbox checked={isFilterSelected('language')} onChange={() => handleFilterToggle('language')} />
                    Language
                    <br />
                    <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                        <InputLabel id="language-select-label"> Language </InputLabel>
                        <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        onChange={handleLanguageChange}
                        >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Arabic">Arabic</MenuItem>
                        <MenuItem value="German">German</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>

                <MenuItem>
                    <Checkbox
                        checked={isFilterSelected('availableDatesAndTimes')}
                        onChange={() => handleFilterToggle('availableDatesAndTimes')}
                    />
                    Dates & Times
                    <br />
                    <input
                        type="datetime-local"
                        value={availableDatesAndTimes}
                        onChange={(e) => setAvailableDatesAndTimes(e.target.value)} // Update the state with the selected date
                        style={{ marginTop: '10px' }}
                    />
                </MenuItem>

                <MenuItem>
                    <Checkbox
                        checked={isFilterSelected('tags')}
                        onChange={() => handleFilterToggle('tags')}
                    />
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
                                <MenuItem key={tag._id} value={tag.name}>
                                    <Checkbox checked={tags.indexOf(tag.name) > -1} />
                                    {tag.name}
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

        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activities</TableCell>
                <TableCell>Locations</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Available Dates And Times</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Pick Up Location</TableCell>
                <TableCell>Drop Off Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itineraries.map(itinerary => (
                <TableRow key={itinerary._id}>
                  <TableCell>
                    {itinerary.activity && itinerary.activity.length > 0
                      ? itinerary.activity.map((activity, index) => (
                        <div key={index}>
                          {activity.name || 'N/A'}- Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                          Location: {activity.location || 'N/A'},<br />
                          Category: {activity.category || 'N/A'}
                          <br /><br /> 
                        </div>
                      ))
                      : 'No activities available'}
                  </TableCell>
                  <TableCell>
                    {itinerary.locations && itinerary.locations.length > 0 ? (
                      itinerary.locations.map((location, index) => (
                        <div key={index}>
                          <Typography variant="body1">
                            {index + 1}: {location.trim()}
                          </Typography>
                          <br />
                        </div>
                      ))
                    ) : 'No locations available'}

                  </TableCell>               
                     <TableCell>{itinerary.timeline}</TableCell>
                  <TableCell>{itinerary.language}</TableCell>
                  <TableCell>{itinerary.price}</TableCell>
                  <TableCell>
                      {itinerary.availableDatesAndTimes.length > 0
                      ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                        const dateObj = new Date(dateTime); 
                        const date = dateObj.toISOString().split('T')[0]; 
                        const time = dateObj.toTimeString().split(' ')[0]; 
                        return (
                          <div key={index}>
                            Date {index + 1}: {date}<br />
                            Time {index + 1}: {time}                          
                          </div>
                        );
                      })
                      : 'No available dates and times'}
                  </TableCell>
                  <TableCell>{itinerary.accessibility}</TableCell>
                  <TableCell>{itinerary.pickUpLocation}</TableCell>
                  <TableCell>{itinerary.dropOffLocation}</TableCell>
                  <TableCell>{itinerary.rating}</TableCell>
                  <TableCell>
                        {itinerary.tags && itinerary.tags.length > 0
                        ? itinerary.tags.map((tag, index) => (
                            <div key={index}>
                            {tag || 'N/A'}
                            <br /><br />
                            </div>
                        ))
                        : 'No tags available'}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
        </div>
    );

}


export default ViewUpcomingItinerary;