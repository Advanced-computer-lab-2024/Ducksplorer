import React from "react";
import {useState, useEffect}  from "react";
import axios from "axios";
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    MenuItem, IconButton, Menu, Checkbox, Slider
  } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';



const ViewUpcomingItinerary = () => {
    const [itineraries, setItineraries] = useState([]);

    const [sortBy, setSortBy] = useState('price'); // Default to 'price'
    const [sortOrder, setSortOrder] = useState('asc'); // Default to 'asc'

    const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
    const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null);

    const [price, setPrice] = useState('');
    const [language, setLanguage] = useState('');
    const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState('');
    //const [filter, setFilter] = useState('');

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

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
        } else {
            // Add filter if not selected
            newFilters.push(filter);
        }
        setSelectedFilters(newFilters);
    };
    
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

    // Fetch itineraries based on the sorting criteria
    useEffect(() => {
        axios.get(`http://localhost:8000/itinerary/sort?sortBy=${sortBy}&sortOrder=${sortOrder}`)
            .then(response => {
                setItineraries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the itineraries!', error);
            });
    }, [sortBy, sortOrder]);

    //filter by price, lang, or dates
    useEffect(() => {
        axios.get(`http://localhost:8000/itinerary/filter?price=${price}|language=${language}|availableDatesAndTimes=${availableDatesAndTimes}`)
            .then(response => {
                setItineraries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the itineraries!', error);
            });
    }, [price, language, availableDatesAndTimes]);

    return (
        <div>
        <Box sx={{ p: 6, maxWidth: 1200 }}>
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
                <MenuItem value="price" onClick={() => { setSortBy('price'); handleSortByClose(); }}>Price</MenuItem>
                <MenuItem value="rating" onClick={() => { setSortBy('rating'); handleSortByClose(); }}>Rating</MenuItem>
            </Menu>

            {/* Sort Order Icon Button */}
            <IconButton onClick={handleSortOrderClick}>
                <SwapVertIcon />
            </IconButton>
            <Menu
                anchorEl={sortOrderAnchorEl}
                open={Boolean(sortOrderAnchorEl)}
                onClose={handleSortOrderClose}
            >
                <MenuItem value="asc" onClick={() => { setSortOrder('asc'); handleSortOrderClose(); }}>Ascending</MenuItem>
                <MenuItem value="desc" onClick={() => { setSortOrder('desc'); handleSortOrderClose(); }}>Descending</MenuItem>
            </Menu>
            <IconButton onClick={handleFilterChoiceClick}>
                <FilterAltIcon />
            </IconButton>
            <Menu 
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
            >
            <MenuItem>
                <Checkbox
                    checked={isFilterSelected('price')}
                    onChange={() => handleFilterToggle('price')}
                />
                Price
            </MenuItem>
            <MenuItem>
                <Checkbox
                    checked={isFilterSelected('language')}
                    onChange={() => handleFilterToggle('language')}
                />
                Language
            </MenuItem>
            <MenuItem>
                <Checkbox
                    checked={isFilterSelected('availableDatesAndTimes')}
                    onChange={() => handleFilterToggle('availableDatesAndTimes')}
                />
                Dates
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
        </div>
    );

}


export default ViewUpcomingItinerary;