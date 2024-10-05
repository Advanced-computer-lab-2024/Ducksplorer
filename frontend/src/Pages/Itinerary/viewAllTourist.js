import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Button, Stack, TextField, Typography, Box, TableContainer, Menu, MenuItem, 
    Checkbox, Slider, Select, Paper, Table, TableHead, TableRow, TableCell, 
    TableBody, IconButton, FormControl, InputLabel } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Link } from 'react-router-dom';


function SearchItineraries() {
    const [searchTerm, setSearchTerm] = useState(''); // Single search term
    const [itineraries, setItineraries] = useState([]);

    //filtering consts
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [language, setLanguage] = useState('');
    const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 5000]); 

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    //default rendering of all itineraries
    useEffect(() => {
        axios.get('http://localhost:8000/itinerary/')
          .then(response => {
            setItineraries(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the itineraries!', error);
          });
    }, []);

    //search handler
    const handleSearchItineraries = async () => {
        try {
            const response = await axios.get('http://localhost:8000/itinerary/search', {
                params: {
                    searchTerm 
                },
            });

            if (response.status === 200) {
                message.success('Itineraries viewed successfully'); //might remove this 
                setItineraries(response.data); 
            } else {
                message.error('Failed to search itineraries');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        }
    };

    //filtering handlers
    const isFilterSelected = (filter) => selectedFilters.includes(filter);

    const handleFilterChoiceClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
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

        axios.get('http://localhost:8000/itinerary/')
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


    //filter by price, lang, or dates
    const handleFilter = () => {
        let dateQuery = '';
    
        if (availableDatesAndTimes) {
            // Try to convert availableDatesAndTimes to a Date object
            const selectedDate = new Date(availableDatesAndTimes);
            
            // Check if the conversion is successful and the date is valid
            if (!isNaN(selectedDate.getTime())) {
                dateQuery = selectedDate.toISOString();
            }
        }        
        axios.get(`http://localhost:8000/itinerary/filter?minPrice=${minPrice}&maxPrice=${maxPrice}&language=${language}&availableDatesAndTimes=${dateQuery}`)
            .then((response) => {
                setItineraries(response.data); 
            })
            .catch(error => {
                message.error('Error fetching itineraries!')
            });
        handleFilterClose();
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Link to="/touristDashboard"> Back </Link>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">
            Available itineraries
          </Typography>
        </Box>            
            <Stack spacing={2} style={{ marginBottom: '20px' }}>
                <TextField
                    label="Enter Name or Category"
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchItineraries}
                >
                    Search
                </Button>

                {/* Filtering */}
                <IconButton onClick={handleFilterChoiceClick} >  {/* try to make it on the right later */}
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
                                sx={{ width: 300, marginLeft: 2, marginTop: '10px' }} // Adjust slider width and margin
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
                            <InputLabel id="language-select-label">Language</InputLabel>
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
                        <Button onClick={handleFilter}>Apply Filters</Button>
                    </MenuItem>
                    <MenuItem>
                        <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
                    </MenuItem>
                </Menu>

            </Stack>

            <div style={{ flex: 1, overflowY: 'auto' }}> 
                {itineraries.length > 0 ? (
                    <Box>
                        <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'scroll' }}> {/* Limit table height and make it scroll */}
                            <Table stickyHeader> 
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Activities</TableCell>
                                        <TableCell>Locations</TableCell>
                                        <TableCell>Timeline</TableCell>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Available Dates and Times</TableCell>
                                        <TableCell>Accessibility</TableCell>
                                        <TableCell>Pick Up Location</TableCell>
                                        <TableCell>Drop Off Location</TableCell>
                                        <TableCell>Ratings</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itineraries.map(itinerary => (
                                        <TableRow key={itinerary._id}>
                                            <TableCell>
                                                {itinerary.activity && itinerary.activity.length > 0
                                                    ? itinerary.activity.map((activity, index) => (
                                                        <div key={index}>
                                                            {activity.name || 'N/A'} - Price: {activity.price !== undefined ? activity.price : 'N/A'},<br />
                                                            Location: {activity.location || 'N/A'},<br />
                                                            Category: {activity.category || 'N/A'}
                                                            <br /><br />
                                                        </div>
                                                    ))
                                                    : 'No activities available'}
                                            </TableCell>
                                            <TableCell>{itinerary.locations}</TableCell>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        No itineraries found.
                    </Typography>
                )}
            </div>
        </div>
    );
}

export default SearchItineraries;
