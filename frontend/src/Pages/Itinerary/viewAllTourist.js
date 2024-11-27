import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  TableContainer,
  Menu,
  MenuItem,
  Checkbox,
  Slider,
  Select,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  InputLabel,
  Rating,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Link, useParams } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar";


function SearchItineraries() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const [itineraries, setItineraries] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";

  //filtering consts
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [tags, setTags] = useState([]); // Tags selected by the user
  const [allTags, setAllTags] = useState([]); // All available tags from backend

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  //default rendering of all itineraries
  useEffect(() => {
    const showPreferences = localStorage.getItem("showPreferences");
    const user = JSON.parse(localStorage.getItem("user"));

    const username = user?.username;
    const role = user?.role;
    axios
      .get("http://localhost:8000/itinerary/", {
        params: {
          showPreferences: showPreferences.toString(),
          username,
          role,
        },
      })
      .then((response) => {
        if (id === undefined) {
          setItineraries(response.data);
        } else {
          const tempItineraries = response.data.filter(
            (itinerary) => itinerary._id === id
          );
          setItineraries(tempItineraries);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the itineraries!", error);
      });
  }, [id]);

  //search handler
  const handleSearchItineraries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/itinerary/search",
        {
          params: {
            searchTerm,
          },
        }
      );

      if (response.status === 200) {
        setItineraries(response.data);
      } else {
        message.error("Failed to search itineraries");
      }
    } catch (error) {
      message.error(" No itineraries found ");
    }
  };

  //filtering handlers

  //get all pref tags from table
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/preferenceTags/");
        const data = await response.json();
        setAllTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

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

      switch (filter) {
        case "minPrice":
          setMinPrice("");
          break;
        case "maxPrice":
          setMaxPrice("");
          break;
        case "language":
          setLanguage("");
          break;
        case "availableDatesAndTimes":
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

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  //clear all filters
  const handleClearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setLanguage("");
    setAvailableDatesAndTimes(null);
    setSelectedFilters([]);
    setTags([]);

    axios
      .get("http://localhost:8000/itinerary/")
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the itineraries!", error);
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

  const handleTagsChange = (event) => {
    const value = event.target.value;
    setTags(value);
  };

  //for price slider
  const [anchorEl, setAnchorEl] = useState(null);

  //encoding tags
  const encodeTags = (tags) => {
    if (Array.isArray(tags)) {
      return tags.map((tag) => encodeURIComponent(tag));
    }
    return encodeURIComponent(tags);
  };

  //filter by price, lang, or dates
  const handleFilter = () => {
    let dateQuery = "";
    const encodedTags = encodeTags(tags).join(",");

    if (availableDatesAndTimes) {
      // Try to convert availableDatesAndTimes to a Date object
      const selectedDate = new Date(availableDatesAndTimes);

      // Check if the conversion is successful and the date is valid
      if (!isNaN(selectedDate.getTime())) {
        dateQuery = selectedDate.toISOString();
      }
    }
    axios
      .get(
        `http://localhost:8000/itinerary/filter?minPrice=${minPrice}&maxPrice=${maxPrice}&language=${language}&availableDatesAndTimes=${dateQuery}&tags=${encodedTags}`
      )
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        message.error("Error fetching itineraries!");
      });
    handleFilterClose();
  };

  // Share itinerary functionality
  const handleShareLink = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    window.location.href = `mailto:?subject=Check out this itinerary&body=Here is the link to the itinerary: ${link}`;
  };

  return (
    <Box
    sx={{
      height: "100vh",
      backgroundColor: "#f9f9f9", // Light background for better contrast
      paddingTop: "64px", // Adjust for navbar height
    }}
  >
         <TouristNavBar />
         <TouristSidebar/>
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "visible",
        height: "100vh",
      }}
    >
      <Link
        to={isGuest ? "/guestDashboard" : "/touristDashboard"}
        className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
      >
        Back
      </Link>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4">Available itineraries</Typography>
      </Box>
      <Stack spacing={2} style={{ marginBottom: "20px" }}>
        <TextField
          label="Enter Name or Category or Tag"
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
        <IconButton onClick={handleFilterChoiceClick}>
          {" "}
          {/* try to make it on the right later */}
          <FilterAltIcon />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <Checkbox
              checked={isFilterSelected("price")}
              onChange={(e) => {
                handleFilterToggle("price");
                if (!e.target.checked) {
                  // Reset price filters if unchecked
                  setMinPrice("");
                  setMaxPrice("");
                  setPriceRange([0, 5000]); // Reset the slider to initial values
                }
              }}
            />
            Price
            <br />
            <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
              Select Price Range
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem>
                <Typography variant="subtitle1">Select Range:</Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5000}
                  sx={{ width: 300, marginLeft: 2, marginTop: "10px" }} // Adjust slider width and margin
                />
              </MenuItem>
              <MenuItem>
                <Typography variant="body1">
                  Selected Min: {priceRange[0]}
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body1">
                  Selected Max: {priceRange[1]}
                </Typography>
              </MenuItem>
            </Menu>
          </MenuItem>

          <MenuItem>
            <Checkbox
              checked={isFilterSelected("language")}
              onChange={() => handleFilterToggle("language")}
            />
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
              checked={isFilterSelected("availableDatesAndTimes")}
              onChange={() => handleFilterToggle("availableDatesAndTimes")}
            />
            Dates & Times
            <br />
            <input
              type="datetime-local"
              value={availableDatesAndTimes}
              onChange={(e) => setAvailableDatesAndTimes(e.target.value)} // Update the state with the selected date
              style={{ marginTop: "10px" }}
            />
          </MenuItem>

          <MenuItem>
            <Checkbox
              checked={isFilterSelected("tags")}
              onChange={() => handleFilterToggle("tags")}
            />
            <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
              <InputLabel id="tags-select-label">Tags</InputLabel>
              <Select
                labelId="tags-select-label"
                id="tags-select"
                multiple
                value={tags}
                onChange={handleTagsChange}
                renderValue={(selected) => selected.join(", ")}
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
      </Stack>

            <div style={{ flex: 1 }}>
                {itineraries.length > 0 ? (
                    <Box >
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Activities</TableCell>
                                        <TableCell>Locations</TableCell>
                                        <TableCell>Timeline</TableCell>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Price
                                            <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                                        </TableCell>
                                        <TableCell>Available Dates and Times</TableCell>
                                        <TableCell>Accessibility</TableCell>
                                        <TableCell>Pick Up Location</TableCell>
                                        <TableCell>Drop Off Location</TableCell>
                                        <TableCell>Ratings</TableCell>
                                        <TableCell>Tags</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itineraries.map(itinerary => itinerary.flag=== false && itinerary.isDeactivated===false && itinerary.tourGuideDeleted===false && itinerary.deletedItinerary===false? (
                                        <TableRow key={itinerary._id}>
                                            <TableCell>
                                                {itinerary.activity && itinerary.activity.length > 0
                                                    ? itinerary.activity.map((activity, index) => (
                                                        <div key={index}>
                                                            {activity.name || 'N/A'} - Price: {""}
                                                            {activity.price !== undefined ? activity.price : 'N/A'},<br />
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
                                                                Location {index + 1}: {location.trim()}
                                                            </Typography>
                                                            <br />
                                                        </div>
                                                    ))
                                                ) : 'No locations available'}

                                            </TableCell>
                                            <TableCell>{itinerary.timeline}</TableCell>
                                            <TableCell>{itinerary.language}</TableCell>
                                            <TableCell>
                                                {(itinerary.price * (exchangeRates[currency] || 1)).toFixed(2)} {" "}
                                                {currency}
                                            </TableCell>
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
                                            <TableCell><Rating
                                                value={itinerary.averageRating}
                                                precision={0.1}
                                                readOnly
                                            /></TableCell>
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
                                            {id === undefined ? (<TableCell>
                                                <Button variant="outlined" onClick={() => handleShareLink(itinerary._id)}>
                                                    Share Via Link
                                                </Button>
                                                <Button variant="outlined" onClick={() => handleShareEmail(itinerary._id)}>
                                                    Share Via Email
                                                </Button>
                                            </TableCell>) : null
                                            }
                                        </TableRow>
                                    ) : null)   // We don't output a row when it has `itinerary.flag` is true (ie itinerary is inappropriate) or when the itinerary is inactive or its tour guide has left the system  or the itinerary has been deleted but cannot be removed from database since it is booked my previous tourists
                                    }

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
            </Box>
            <Help />
        </Box>
    );
}

export default SearchItineraries;
